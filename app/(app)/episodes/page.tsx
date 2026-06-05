'use client';

import { useState, useEffect } from 'react';
import { Film, Wand2, RefreshCw, Copy, Check, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAuthHeaders } from '@/hooks/useAuth';

interface Episode {
  id: string;
  number: number;
  title: string;
  content: string;
}

interface Project {
  id: string;
  title: string;
}

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('none');
  const [selectedEp, setSelectedEp] = useState<Episode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bible, setBible] = useState('');
  const [characters, setCharacters] = useState('');
  const [epNumber, setEpNumber] = useState('1');
  const [epTitle, setEpTitle] = useState('');

  useEffect(() => {
    getAuthHeaders().then(headers => {
      fetch('/api/projects', { headers })
        .then(r => r.json())
        .then(data => setProjects(Array.isArray(data) ? data : []))
        .catch(() => {});
    });
  }, []);

  const handleGenerate = async () => {
    if (!bible) return;
    setIsGenerating(true);
    setStreamContent('');

    try {
      const response = await fetch('/api/generate-episode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bible, characters, epNumber, epTitle }),
      });

      if (!response.ok) throw new Error('API error');

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

      const newEp: Episode = {
        id: Date.now().toString(),
        number: parseInt(epNumber),
        title: epTitle || `Episode ${epNumber}`,
        content: fullContent,
      };

      setEpisodes(prev => [...prev, newEp].sort((a, b) => a.number - b.number));
      setSelectedEp(newEp);
      setStreamContent('');

      if (selectedProject && selectedProject !== 'none') {
        await saveToProject(newEp, selectedProject);
      }
    } catch (e) {
      setStreamContent('Generation failed.');
    }

    setIsGenerating(false);
  };

  const saveToProject = async (ep: Episode, projectId: string) => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      await fetch('/api/save-content', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          table: 'episodes',
          data: {
            project_id: projectId,
            number: ep.number,
            title: ep.title,
            content: ep.content,
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
    setEpisodes(prev => prev.filter(e => e.id !== id));
    if (selectedEp?.id === id) setSelectedEp(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Episode Generator</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate full clip-by-clip scripts for each episode.
        </p>
      </div>

      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6 space-y-4">
          {projects.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Save to project (optional)</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Series bible</Label>
            <Textarea
              value={bible}
              onChange={e => setBible(e.target.value)}
              placeholder="Paste your full series bible here..."
              className="bg-white/5 border-white/10 min-h-[120px] resize-none"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Character sheets (optional)</Label>
            <Textarea
              value={characters}
              onChange={e => setCharacters(e.target.value)}
              placeholder="Paste character sheets here..."
              className="bg-white/5 border-white/10 min-h-[80px] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Episode number</Label>
              <Input
                type="number"
                value={epNumber}
                onChange={e => setEpNumber(e.target.value)}
                min="1"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Title (optional)</Label>
              <Input
                value={epTitle}
                onChange={e => setEpTitle(e.target.value)}
                placeholder="e.g. The Secret"
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !bible}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-medium"
          >
            {isGenerating ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" />Generate full script</>
            )}
          </Button>
          {saved && (
            <p className="text-xs text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved to project
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
            {episodes.length} {episodes.length === 1 ? 'episode' : 'episodes'}
          </span>
          {episodes.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">No episodes generated yet.</p>
          )}
          {episodes.map(ep => (
            <div
              key={ep.id}
              onClick={() => setSelectedEp(ep)}
              className={`group rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                selectedEp?.id === ep.id
                  ? 'border-cyan-500/30 bg-cyan-500/5'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-400/20 flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-sm">{ep.number}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ep.title}</p>
                    <p className="text-xs text-muted-foreground">Episode {ep.number}</p>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(ep.id); }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedEp ? (
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedEp.title}</CardTitle>
                  <div className="flex items-center gap-3">
                    {selectedProject && selectedProject !== 'none' && (
                      <button
                        onClick={() => saveToProject(selectedEp, selectedProject)}
                        disabled={saving}
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(selectedEp.content)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-[600px] overflow-y-auto">
                  {selectedEp.content}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/5 bg-white/[0.02] h-full flex items-center justify-center">
              <CardContent className="text-center py-20">
                <Film className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Generate an episode or select one</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
