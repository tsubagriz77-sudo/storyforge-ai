import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { pitch, genre, tone, audience } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const prompt = `Tu es un scénariste expert en mini-séries TikTok anime style.

Génère une bible de série complète pour ce pitch : "${pitch}"

Paramètres :
- Genre : ${genre}
- Ton : ${tone}
- Audience cible : ${audience}

Structure ta réponse ainsi :

## [TITRE DE LA SÉRIE]

**Tagline :** Une phrase accrocheuse

**Pitch :** 3 lignes maximum

**Univers & Setting :** Description de l'univers

**Personnages principaux :**
Liste 4-5 personnages avec leur rôle et arc narratif

**Structure en 10 épisodes :**
Pour chaque épisode : numéro, titre, résumé en 2 lignes, cliffhanger

**Twist de mi-saison :** (épisode 5)

**Révélation finale :** (épisode 10)

**Style visuel anime :** Description du style graphique recommandé

Réponds uniquement en français. Sois cinématographique et émotionnel.`;

  const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return new Response(`Erreur Gemini: ${error}`, { status: 500 });
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
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (text) controller.enqueue(new TextEncoder().encode(text));
            } catch {}
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
