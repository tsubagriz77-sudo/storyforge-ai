import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { script, characterDesc, style, animeStyle } = await req.json();
  const visualStyle = style || animeStyle || 'Anime';

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const prompt = `You are an expert in AI art direction and video generation for Google Flow / Veo (any visual style: anime, realistic, cinematic, stylized 3D, etc.).

User-chosen visual style: ${visualStyle}

Build a dedicated style prefix for EACH clip that faithfully matches "${visualStyle}" — do not use a generic anime prefix unless the chosen style is anime. Examples:
- Anime / 2D: line art, cel-shading, flat colors, anime composition, etc.
- Realistic / cinematic: photorealistic, film grain, lens, natural lighting, depth of field, etc.
- Other styles: use terminology appropriate to that look.

Always end the style prefix with: 1080p vertical format (9:16).

${characterDesc ? `Character visual descriptions:\n${characterDesc}\n` : ''}

Episode script:
${script}

For each clip in the script, generate a complete Google Flow / Veo prompt.

Format for each clip (respond only in English):

### CLIP [number] — [scene title/type]

**Scene:** Short scene description

**Google Flow prompt:**
[Adaptive style prefix matching "${visualStyle}"] + [Detailed English description: set, lighting, camera angle, characters with precise appearance and clothing, action, motion]

**Lip Sync:** [If dialogue: exact transcript + syllable-by-syllable lip movement description]

**Audio:** [Exact dialogue or VO description]

---

Be extremely precise with visual descriptions. Keep character visuals consistent across all clips. Match the user style "${visualStyle}" in every style prefix — never default to anime when another style was chosen.`;

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return new Response(`Erreur Groq: ${error}`, { status: 500 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const text = parsed.choices?.[0]?.delta?.content || '';
            if (text) controller.enqueue(new TextEncoder().encode(text));
          } catch {}
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
