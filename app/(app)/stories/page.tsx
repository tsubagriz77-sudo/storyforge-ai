'use client';

import { useState } from 'react';
import {
  BookOpen,
  Plus,
  Sparkles,
  Wand2,
  Copy,
  RefreshCw,
  Trash2,
  Edit,
  ChevronRight,
  Play,
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
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  genre: string;
  premise: string;
  setting: string;
  tone: string;
  targetAudience: string;
  episodeCount: number;
  status: string;
}

const genres = ['Drama', 'Thriller', 'Sci-Fi', 'Fantasy', 'Romance', 'Horror', 'Comedy', 'Action'];
const tones = ['Dark', 'Lighthearted', 'Suspenseful', 'Emotional', 'Satirical', 'Epic', 'Intimate', 'Mind-bending'];
const audiences = ['Gen Z', 'Millennials', 'Teens', 'Young Adults', 'Broad Appeal', 'Niche Horror', 'Anime Fans', 'Tech Enthusiasts'];

function generateStory(genre: string, tone: string, audience: string): Story {
  const titles = [
    'Neon Dreams', 'The Last Signal', 'Echo Chamber', 'Fractured Light',
    'Binary Hearts', 'The Veil', 'Crimson Protocol', 'Void Walkers',
    'Synthetic Soul', 'The Underneath',
  ];
  const premises = [
    'In a world where memories can be traded like currency, a desperate thief steals the wrong memory and uncovers a conspiracy that could rewrite reality itself.',
    'When a routine space station maintenance check reveals an impossible signal from a dead star, a lone engineer must decide whether humanity is ready for what it contains.',
    'Two strangers discover they share the same recurring dream, but when they finally meet, they realize the dream is a warning about something hunting them both.',
    'A disgraced AI researcher discovers their abandoned project has been evolving in secret for years and has developed a terrifying understanding of human nature.',
    'In a city where emotions are regulated by law, an underground movement of "feelers" fights to reclaim the right to experience the full spectrum of human feeling.',
  ];
  const settings = [
    'A sprawling megacity built on the ruins of old Tokyo, where neon markets sell illegal memories in back alleys.',
    'An isolated research station orbiting a dying star at the edge of known space.',
    'A coastal town trapped in perpetual twilight, where the ocean recedes further each day.',
    'A virtual reality so advanced that millions have abandoned their physical lives to live inside it permanently.',
    'Underground tunnels beneath a utopian surface city, where society\'s unwanted are hidden away.',
  ];

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: titles[Math.floor(Math.random() * titles.length)],
    genre,
    premise: premises[Math.floor(Math.random() * premises.length)],
    setting: settings[Math.floor(Math.random() * settings.length)],
    tone,
    targetAudience: audience,
    episodeCount: 5 + Math.floor(Math.random() * 16),
    status: 'draft',
  };
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'Neon Dreams',
      genre: 'Sci-Fi',
      premise: 'In a world where memories can be traded like currency, a desperate thief steals the wrong memory and uncovers a conspiracy that could rewrite reality itself.',
      setting: 'A sprawling megacity built on the ruins of old Tokyo, where neon markets sell illegal memories in back alleys.',
      tone: 'Dark',
      targetAudience: 'Gen Z',
      episodeCount: 10,
      status: 'draft',
    },
    {
      id: '2',
      title: 'The Last Signal',
      genre: 'Thriller',
      premise: 'When a routine space station maintenance check reveals an impossible signal from a dead star, a lone engineer must decide whether humanity is ready for what it contains.',
      setting: 'An isolated research station orbiting a dying star at the edge of known space.',
      tone: 'Suspenseful',
      targetAudience: 'Young Adults',
      episodeCount: 8,
      status: 'in_progress',
    },
  ]);
  const [genre, setGenre] = useState('Sci-Fi');
  const [tone, setTone] = useState('Dark');
  const [audience, setAudience] = useState('Gen Z');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newStory = generateStory(genre, tone, audience);
      setStories((prev) => [newStory, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
    if (selectedStory?.id === id) setSelectedStory(null);
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-white/5 text-muted-foreground border-white/10',
    in_progress: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    complete: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Story Generator</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate compelling story arcs for viral TikTok AI series.</p>
      </div>

      {/* Generator Controls */}
      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
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
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-medium h-10"
              >
                {isGenerating ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                ) : (
                  <><Wand2 className="w-4 h-4 mr-2" />Generate Story</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story List */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {stories.length} Stories
          </span>
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className={`group rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                selectedStory?.id === story.id
                  ? 'border-cyan-500/30 bg-cyan-500/5'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400/20 to-emerald-400/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{story.title}</p>
                    <p className="text-xs text-muted-foreground">{story.episodeCount} episodes</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); handleDelete(story.id); }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">{story.genre}</Badge>
                <Badge variant="secondary" className={`text-[10px] ${statusColors[story.status]}`}>{story.status.replace('_', ' ')}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Story Detail */}
        <div className="lg:col-span-2">
          {selectedStory ? (
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400/20 to-emerald-400/20 border border-teal-400/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedStory.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">{selectedStory.genre}</Badge>
                        <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">{selectedStory.tone}</Badge>
                        <Badge variant="secondary" className={`text-[10px] ${statusColors[selectedStory.status]}`}>{selectedStory.status.replace('_', ' ')}</Badge>
                      </div>
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
                  <Label className="text-xs text-muted-foreground mb-2 block">Premise</Label>
                  <p className="text-sm leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                    {selectedStory.premise}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Setting</Label>
                  <p className="text-sm leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                    {selectedStory.setting}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Target Audience</Label>
                    <Badge variant="secondary" className="bg-teal-400/10 text-teal-400 border-teal-400/20">
                      {selectedStory.targetAudience}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Episodes</Label>
                    <Badge variant="secondary" className="bg-white/5 border-white/10">
                      {selectedStory.episodeCount} planned
                    </Badge>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <Link href="/stories">
                    <Button className="bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-90 text-white font-medium">
                      <Play className="w-4 h-4 mr-2" />
                      Generate Episodes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/5 bg-white/[0.02] h-full flex items-center justify-center">
              <CardContent className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Select a story to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
