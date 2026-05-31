'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Wand2, Copy, RefreshCw, Trash2, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Story {
  id: string;
  title: string;
  genre: string;
  tone: string;
  targetAudience: string;
  content: string;
}

interface Project {
  id: string;
  title: string;
}

const genres = ['Drame', 'Thriller', 'Sci-Fi', 'Fantasy', 'Romance', 'Horreur', 'Comedie', 'Action'];
const tones = ['Sombre', 'Leger', 'Suspense', 'Emotionnel', 'Epique', 'Intime'];
const audiences = ['Gen Z', 'Millennials', 'Ados', 'Fans anime', 'Grand public'];

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [genre, setGenre] = useState('Drame');
  const [tone, setTone] = useState('Sombre');
  const [audience, setAudience] = useState('Gen Z');
  const [pitch, setPitch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setProjects(data))
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!pitch) return;
    setIsGenerating(true);
    setStreamContent('');

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch, genre, tone, audience }),
      });

      if (!response.ok) throw new Error('Erreur API');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          fullContent += chunk;
          setStreamContent(fullContent);
        }
      }

      const titleMatch = fullContent.match(/#{1,2}\s+(.+)/);
      const title = titleMatch ? titleMatch[1].trim() : pitch.slice(0, 40);

      const newStory: Story = {
        id: Date.now().toString(),
        title,
        genre,
        tone,
        targetAudience: audience,
        content: fullContent,
      };

      setStories(prev => [newStory, ...prev]);
      setSelectedStory(newStory);
      setStreamContent('');

      // Sauvegarde automatique si un projet est selectionne
      if (selectedProject) {
        await saveToProject(newStory, selectedProject);
      }
    } catch (e) {
      setStreamContent('Erreur lors de la generation.');
    }

    setIsGenerating(false);
  };

  const saveToProject = async (story: Story, projectId: string) => {
    setSaving(true);
    try {
      await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'episodes',
          data: {
            project_id: projectId,
            number: 0,
            title: story.title,
            content: story.content,
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleDelete = (id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
    if (selectedStory?.id === id) setSelectedStory(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Generateur de Series</h1>
        <p className="text-muted-foreground text-sm mt-1">Genere une bible complete pour ta mini-serie TikTok.</p>
      </div>

      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6 space-y-4">
          {projects.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Sauvegarder dans un projet (optionnel)</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Choisir un projet..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun projet</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Pitch de ta serie</Label>
            <Textarea
              value={pitch}
              onChange={e => setPitch(e.target.value)}
              placeholder="Ex : Deux ados dont les familles se haissent depuis 30 ans se retrouvent dans le meme lycee..."
              className="bg-white/5 border-white/10 min-h-[100px] resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Ton</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                  {audiences.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !pitch}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-medium"
          >
            {isGenerating ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generation en cours...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" />Generer la bible complete</>
            )}
          </Button>
          {saved && (
            <p className="text-xs text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Sauvegarde dans le projet
            </p>
          )}
        </CardContent>
      </Card>

      {(isGenerating || streamContent) && (
        <Card className="border-white/5 bg-white/[0.02] mb-8">
          <CardContent className="p-6">
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto">
              {streamContent}
              {isGenerating && <span className="animate-pulse text-cyan-400">&#9611;</span>}
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {stories.length} Serie{stories.length > 1 ? 's' : ''}
          </span>
          {stories.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">Aucune serie generee pour l&apos;instant.</p>
          )}
          {stories.map(story => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className={`group rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                selectedStory?.id === story.id
                  ? 'border-cyan-500/30 bg-cyan-500/5'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400/20 to-emerald-400/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{story.title}</p>
                    <p className="text-xs text-muted-foreground">{story.genre} · {story.tone}</p>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(story.id); }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">
                {story.targetAudience}
              </Badge>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedStory ? (
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedStory.title}</CardTitle>
                  <div className="flex items-center gap-3">
                    {selectedProject && (
                      <button
                        onClick={() => saveToProject(selectedStory, selectedProject)}
                        disabled={saving}
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(selectedStory.content)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copie' : 'Copier'}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-[600px] overflow-y-auto">
                  {selectedStory.content}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/5 bg-white/[0.02] h-full flex items-center justify-center">
              <CardContent className="text-center py-20">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Genere une serie ou selectionnes-en une</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
