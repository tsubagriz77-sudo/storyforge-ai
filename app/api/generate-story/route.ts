import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { pitch, genre, tone, audience } = await req.json();

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

  const result = await model.generateContentStream(prompt);

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
