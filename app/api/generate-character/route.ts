import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, role, context } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response('Clé API manquante', { status: 500 });
  }

  const prompt = `Tu es un directeur artistique expert en anime japonais et en production IA vidéo.

Cree une fiche personnage complete et ultra-detaillee pour ce personnage :
- Nom : ${name}
- Role : ${role || 'personnage principal'}
${context ? `- Contexte de la serie : ${context}` : ''}

IMPORTANT : Invente tous les details manquants de facon coherente avec le nom et le role. Sois tres precis et concret.

Reponds exactement dans ce format :

## ${name}

**Age :** [nombre precis]
**Taille :** [en cm]
**Poids :** [en kg]
**Anniversaire :** [jour et mois]
**Nationalite :** [pays]

---

### PERSONNALITE
[5 traits de caractere detailles, 2-3 phrases chacun]

### APPARENCE PHYSIQUE
- **Peau :** [description precise + teinte]
- **Cheveux :** [couleur, longueur, coiffure] — Code hex : #[code]
- **Yeux :** [couleur, forme, expression] — Code hex : #[code]
- **Morphologie :** [corpulence, taille, posture]
- **Expression habituelle :** [description]

### PALETTE DE COULEURS
1. #[code] — [nom de la couleur] ([usage : vetements/peau/cheveux])
2. #[code] — [nom de la couleur] ([usage])
3. #[code] — [nom de la couleur] ([usage])
4. #[code] — [nom de la couleur] ([usage])
5. #[code] — [nom de la couleur] ([usage])

### TENUE SIGNATURE
[Description precise et detaillee des vetements, couleurs exactes, accessoires, chaussures]

### ARC NARRATIF
[Evolution du personnage sur la saison en 3-4 phrases]

### PROMPT IMAGE GOOGLE FLOW
[Prompt en anglais, pret a coller dans Google Flow/Veo. Format : "High-quality 2D anime style, Kuroko no Basket aesthetic, character sheet of [nom], [description physique complete en anglais], front view, side view, back view, full body, [couleurs], white background, professional anime production quality"]

### LIP SYNC
- Son "A" : [description mouvement levres]
- Son "E" : [description]
- Son "I" : [description]
- Son "O" : [description]
- Son "U" : [description]
- Consonne "P/B" : [description]
- Consonne "M" : [description]
- Consonne "T/D" : [description]`;

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
