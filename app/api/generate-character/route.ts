import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, role, context } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const prompt = `You are an expert art director for AI video production (any visual style: anime, realistic, cinematic, stylized, etc.). Always respond in English with complete sentences; never truncate words.

Create a complete, ultra-detailed character sheet for:
- Name: ${name}
- Role: ${role || 'main character'}
${context ? `- Series context: ${context}` : ''}

IMPORTANT: Invent any missing details in a way that is coherent with the name and role. Be very specific and concrete. Infer the best visual style from the series context when provided; otherwise keep the look versatile (not locked to anime).

Respond exactly in this format:

## ${name}

**Age:** [exact number]
**Height:** [in cm]
**Weight:** [in kg]
**Birthday:** [day and month]
**Nationality:** [country]

---

### PERSONALITY
[5 detailed character traits, 2-3 sentences each]

### PHYSICAL APPEARANCE
- **Skin:** [precise description + tone]
- **Hair:** [color, length, style] — Hex: #[code]
- **Eyes:** [color, shape, expression] — Hex: #[code]
- **Build:** [body type, height, posture]
- **Usual expression:** [description]

### COLOR PALETTE
1. #[code] — [color name] ([usage: clothing/skin/hair])
2. #[code] — [color name] ([usage])
3. #[code] — [color name] ([usage])
4. #[code] — [color name] ([usage])
5. #[code] — [color name] ([usage])

### SIGNATURE OUTFIT
[Precise, detailed description of clothing, exact colors, accessories, shoes]

### NARRATIVE ARC
[Character evolution over the season in 3-4 sentences]

### GOOGLE FLOW IMAGE PROMPT
[English prompt ready to paste into Google Flow/Veo. Start with a style prefix that matches the character and series (anime, photorealistic, cinematic, etc.) — do not default to anime unless context requires it. Include: character sheet of [name], full physical description, front/side/back views, full body, colors, white background, production-quality wording for the chosen style]

### LIP SYNC
- "A" sound: [lip movement description]
- "E" sound: [description]
- "I" sound: [description]
- "O" sound: [description]
- "U" sound: [description]
- "P/B" consonant: [description]
- "M" consonant: [description]
- "T/D" consonant: [description]`;

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
        temperature: 0.7,
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
