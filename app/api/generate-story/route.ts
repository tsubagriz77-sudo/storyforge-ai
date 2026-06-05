import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { pitch, genre, tone, audience } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const prompt = `You are an expert screenwriter for short-form vertical video series (TikTok, Reels, etc.).

Generate a complete series bible for this pitch: "${pitch}"

Parameters:
- Genre: ${genre}
- Tone: ${tone}
- Target audience: ${audience}

Structure your response as follows:

## [SERIES TITLE]

**Tagline:** One catchy sentence

**Pitch:** 3 lines maximum

**World & Setting:** Description of the universe

**Main characters:**
List 4-5 characters with their role and narrative arc

**10-episode structure:**
For each episode: number, title, 2-line summary, cliffhanger

**Mid-season twist:** (episode 5)

**Final revelation:** (episode 10)

**Recommended visual style:** Describe the look and feel (anime, realistic, cinematic, stylized 3D, etc.) — match what fits the story; do not default to anime unless it serves the pitch.

Respond only in English. Be cinematic and emotional.`;

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
