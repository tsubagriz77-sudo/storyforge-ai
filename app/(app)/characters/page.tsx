'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Sparkles,
  Wand2,
  Copy,
  RefreshCw,
  ChevronDown,
  Trash2,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  appearance: string;
  voiceStyle: string;
  traits: string[];
}

const sampleTraits = [
  'Mysterious', 'Charismatic', 'Rebellious', 'Wise', 'Ambitious',
  'Playful', 'Stoic', 'Sarcastic', 'Loyal', 'Enigmatic',
  'Fierce', 'Gentle', 'Calculating', 'Passionate', 'Cunning',
];

const genres = ['Drama', 'Thriller', 'Sci-Fi', 'Fantasy', 'Romance', 'Horror', 'Comedy', 'Action'];

const voiceStyles = ['Narrator', 'First Person', 'Dialogue Heavy', 'Poetic', 'Gritty', 'Whimsical', 'Dark', 'Clinical'];

function generateCharacter(genre: string): Character {
  const names = ['Luna Shadow', 'Kai Nomad', 'Aria Flux', 'Rex Cipher', 'Nova Blaze', 'Zara Vex', 'Echo Frost', 'Mira Storm', 'Jax Phantom', 'Ivy Neural'];
  const personalities = [
    'A brooding strategist who speaks in riddles and never reveals their true intentions until the final moment.',
    'An optimistic rebel who fights against oppressive systems with charm and wit.',
    'A haunted survivor carrying deep scars from a past they refuse to discuss.',
    'A brilliant but unstable genius walking the line between salvation and destruction.',
    'A quiet observer who sees patterns others miss and acts with precise timing.',
  ];
  const appearances = [
    'Sharp angular features, cybernetic eye implant, silver-streaked hair, always wears a long dark coat.',
    'Soft rounded face with glowing tattoos that shift patterns based on emotion, flowing garments.',
    'Battle-scarred with a mechanical arm, close-cropped hair, utilitarian clothing with hidden pockets.',
    'Ethereal beauty with eyes that shift color, translucent veils, delicate jewelry made of data crystals.',
    'Rugged and weathered, messy topknot, mix of vintage and futuristic clothing layers.',
  ];

  const name = names[Math.floor(Math.random() * names.length)];
  const numTraits = 2 + Math.floor(Math.random() * 3);
  const shuffled = [...sampleTraits].sort(() => Math.random() - 0.5);
  const traits = shuffled.slice(0, numTraits);

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name,
    description: `A ${genre.toLowerCase()} character designed for viral TikTok storytelling.`,
    personality: personalities[Math.floor(Math.random() * personalities.length)],
    appearance: appearances[Math.floor(Math.random() * appearances.length)],
    voiceStyle: voiceStyles[Math.floor(Math.random() * voiceStyles.length)],
    traits,
  };
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Luna Shadow',
      description: 'A sci-fi thriller character designed for viral TikTok storytelling.',
      personality: 'A brooding strategist who speaks in riddles and never reveals their true intentions until the final moment.',
      appearance: 'Sharp angular features, cybernetic eye implant, silver-streaked hair, always wears a long dark coat.',
      voiceStyle: 'Gritty',
      traits: ['Mysterious', 'Calculating', 'Fierce'],
    },
    {
      id: '2',
      name: 'Kai Nomad',
      description: 'A drama character designed for emotional TikTok storytelling.',
      personality: 'An optimistic rebel who fights against oppressive systems with charm and wit.',
      appearance: 'Soft rounded face with glowing tattoos that shift patterns based on emotion, flowing garments.',
      voiceStyle: 'First Person',
      traits: ['Charismatic', 'Rebellious', 'Loyal'],
    },
  ]);
  const [genre, setGenre] = useState('Sci-Fi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newChar = generateCharacter(genre);
      setCharacters((prev) => [newChar, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    if (selectedChar?.id === id) setSelectedChar(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Character Generator</h1>
        <p className="text-muted-foreground text-sm mt-1">Create AI-powered characters with unique personalities for your TikTok series.</p>
      </div>

      {/* Generator Controls */}
      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label className="text-xs text-muted-foreground mb-2 block">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-medium px-6 h-10"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Character
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {characters.length} Characters
            </span>
          </div>
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => setSelectedChar(char)}
              className={`group rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                selectedChar?.id === char.id
                  ? 'border-cyan-500/30 bg-cyan-500/5'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-400/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{char.name}</p>
                    <p className="text-xs text-muted-foreground">{char.voiceStyle}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); handleDelete(char.id); }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {char.traits.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px] bg-white/5 border-white/10">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Character Detail */}
        <div className="lg:col-span-2">
          {selectedChar ? (
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-400/20 border border-cyan-500/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedChar.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{selectedChar.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Personality</Label>
                  <p className="text-sm leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                    {selectedChar.personality}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Appearance</Label>
                  <p className="text-sm leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                    {selectedChar.appearance}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Voice Style</Label>
                  <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                    {selectedChar.voiceStyle}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Traits</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedChar.traits.map((t) => (
                      <Badge key={t} variant="secondary" className="bg-white/5 border-white/10">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/5 bg-white/[0.02] h-full flex items-center justify-center">
              <CardContent className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Select a character to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
