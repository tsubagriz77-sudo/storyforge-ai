import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { bible, characters, epNumber, epTitle } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const prompt = `Tu es un scénariste expert en mini-séries animées TikTok.

Bible de la série :
${bible}

${characters ? `Personnages :\n${characters}\n` : ''}

Génère le script complet de l'ÉPISODE ${epNumber}${epTitle ? ` — "${epTitle}"` : ''}.

Format : 10 à 12 clips de 6 secondes chacun. Pour chaque clip :

### CLIP [numéro] — [TYPE]
**Timecode :** 00:00 → 00:06
**Type :** SCÈNE / DIAL / VO / SFX
**Description visuelle :** Description précise de la scène (décor, lumière, angle caméra, personnages)
**Dialogue :** [NOM PERSONNAGE] : "texte exact"
**VO :** texte de voix off si applicable
**Émotion :** émotion dominante de la scène

---

Termine par :

### CLIFFHANGER FINAL
Description du cliffhanger qui donne envie de voir l'épisode suivant.

### RÉSUMÉ
Résumé en 2 lignes de l'épisode.

Style : dialogues percutants, tension constante, visuels anime cinématographiques. Total visé : 65-70 secondes.
Réponds uniquement en français.`;

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
