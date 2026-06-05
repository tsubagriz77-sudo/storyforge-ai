import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { bible, characters, epNumber, epTitle } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const prompt = `You are an expert screenwriter for short-form vertical video series (TikTok, Reels, etc.). Visual style may be anime, realistic, cinematic, or any other look — follow the series bible; do not impose anime.

Series bible:
${bible}

${characters ? `Characters:\n${characters}\n` : ''}

Write the full script for EPISODE ${epNumber}${epTitle ? ` — "${epTitle}"` : ''}.

Format: 10 to 12 clips of 6 seconds each. For each clip:

### CLIP [number] — [TYPE]
**Timecode:** 00:00 → 00:06
**Type:** SCENE / DIAL / VO / SFX
**Visual description:** Precise scene description (set, lighting, camera angle, characters) — match the visual style from the bible
**Dialogue:** [CHARACTER NAME]: "exact line"
**VO:** voice-over text if applicable
**Emotion:** dominant emotion of the scene

---

End with:

### FINAL CLIFFHANGER
Description of the cliffhanger that makes viewers want the next episode.

### SUMMARY
2-line episode summary.

Style: punchy dialogue, constant tension, cinematic visuals appropriate to the series look. Target total: 65-70 seconds.
Respond only in English.`;

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
