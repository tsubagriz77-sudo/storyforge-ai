import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, role, context } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const prompt = `Tu es un directeur artistique expert en anime et production IA.

Génère une fiche personnage ultra-détaillée pour : ${name} (${role || 'personnage principal'})
${context ? `\nContexte de la série :\n${context}` : ''}

Structure ta réponse ainsi :

## ${name}

**Âge :** 
**Taille / Poids :**
**Anniversaire :**
**Nationalité :**

---

### PERSONNALITÉ
5 traits caractéristiques détaillés

### APPARENCE PHYSIQUE
Description précise : peau, cheveux (couleur + code hex), yeux (couleur + code hex), morphologie, expression habituelle

### PALETTE DE COULEURS
Liste 5 couleurs avec codes hex pour la génération IA

### TENUE SIGNATURE
Description précise des vêtements, couleurs, accessoires

### ARC NARRATIF
Évolution du personnage sur la saison

### PROMPT IMAGE (Google Flow / Veo)
Prompt en anglais prêt à utiliser pour générer une fiche personnage style anime (3 vues : face, profil, dos)

### LIP SYNC
Description de la bouche et des lèvres pour chaque son principal en français

Sois extrêmement précis sur les descriptions visuelles. Style anime professionnel type Kuroko no Basket.`;

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
