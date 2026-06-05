import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { hookType, context } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const hookTypeLabels: Record<string, string> = {
    opening: 'opening hook (first 3 seconds that stop the scroll)',
    cliffhanger: 'cliffhanger (ending that makes viewers want more)',
    plot_twist: 'unexpected plot twist',
    emotional: 'emotional hook (hits the heart)',
    curiosity_gap: 'curiosity gap (creates an irresistible question)',
    controversy: 'controversial hook (bold opinion that divides)',
  };

  const prompt = `You are an expert in viral short-form video content for vertical mini-series (any visual style: anime, realistic, cinematic, etc.).

Generate exactly 5 hooks of type "${hookTypeLabels[hookType] || hookType}" for a vertical mini-series.
${context ? `\nSeries context: ${context}` : ''}

Rules:
- Each hook must be 2-3 sentences maximum
- Write in English only
- Punchy, emotional, cinematic tone
- Suited to vertical TikTok/Reels format
- Each hook must make viewers want to keep watching immediately
- Do not assume anime style unless the context specifies it

Respond ONLY with valid JSON in this exact format, no markdown or backticks:
{"hooks":["hook 1","hook 2","hook 3","hook 4","hook 5"]}`;

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
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return new Response(`Erreur Groq: ${error}`, { status: 500 });
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '{"hooks":[]}';
  
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response('{"hooks":[]}', {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
