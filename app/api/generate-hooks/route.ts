import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { hookType, context } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const hookTypeLabels: Record<string, string> = {
    opening: 'accroche d\'ouverture (les 3 premières secondes qui stoppent le scroll)',
    cliffhanger: 'cliffhanger (fin qui donne envie de voir la suite)',
    plot_twist: 'retournement de situation inattendu',
    emotional: 'hook émotionnel (qui touche le cœur)',
    curiosity_gap: 'gap de curiosité (qui crée une question irrésistible)',
    controversy: 'hook controversé (opinion choc qui divise)',
  };

  const prompt = `Tu es un expert en création de contenu viral TikTok pour des mini-séries animées.

Génère exactement 5 hooks de type "${hookTypeLabels[hookType] || hookType}" pour une mini-série TikTok.
${context ? `\nContexte de la série : ${context}` : ''}

Règles :
- Chaque hook doit faire maximum 2-3 phrases
- Écris en français
- Style percutant, émotionnel, cinématographique
- Adapté au format vertical TikTok
- Chaque hook doit donner envie de regarder la suite immédiatement

Réponds UNIQUEMENT avec un JSON valide dans ce format exact, sans markdown ni backticks :
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
