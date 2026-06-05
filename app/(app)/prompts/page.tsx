'use client';

import { useState } from 'react';
import { Video, Wand2, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VideoPrompt {
  id: string;
  clipNumber: number;
  scene: string;
  prompt: string;
}

const visualStyles = [
  'Anime',
  'Realistic',
  'Cinematic',
  'Dark Fantasy',
  'Sci-Fi',
  'Watercolor',
  'Comic Book',
  'Studio Ghibli',
];

export default function PromptsPage() {
  const [script, setScript] = useState('');
  const [characterDesc, setCharacterDesc] = useState('');
  const [visualStyle, setVisualStyle] = useState('Anime');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<VideoPrompt[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [streamContent, setStreamContent] = useState('');

  const handleGenerate = async () => {
    if (!script) return;
    setIsGenerating(true);
    setStreamContent('');
    setPrompts([]);

    try {
      const response = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, characterDesc, style: visualStyle }),
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

      const clipMatches = fullContent.split(/(?=###\s*CLIP\s*\d+)/i).filter(s => s.trim());
      const parsedPrompts = clipMatches.map((clip, i) => ({
        id: Date.now().toString() + i,
        clipNumber: i + 1,
        scene: clip.match(/\*\*Scene:\*\*\s*(.+)/i)?.[1]?.trim() || `Clip ${i + 1}`,
        prompt: clip,
      }));

      if (parsedPrompts.length > 0) {
        setPrompts(parsedPrompts);
        setStreamContent('');
      }
    } catch (e) {
      setStreamContent('Generation failed.');
    }

    setIsGenerating(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAll = () => {
    const allText = prompts.map(p => p.prompt).join('\n\n---\n\n');
    navigator.clipboard.writeText(allText);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">AI Video Prompts</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate precise prompts for Google Flow / Veo with lip sync.</p>
      </div>

      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Episode script</Label>
            <Textarea
              value={script}
              onChange={e => setScript(e.target.value)}
              placeholder="Paste your episode script here (numbered clips, dialogue, scene descriptions)..."
              className="bg-white/5 border-white/10 min-h-[150px] resize-none"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Character descriptions (optional)</Label>
            <Textarea
              value={characterDesc}
              onChange={e => setCharacterDesc(e.target.value)}
              placeholder="Paste character sheets here for visual consistency..."
              className="bg-white/5 border-white/10 min-h-[80px] resize-none"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Visual Style</Label>
            <Select value={visualStyle} onValueChange={setVisualStyle}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visualStyles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !script}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-medium"
          >
            {isGenerating ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" />Generate Flow prompts</>
            )}
          </Button>
        </CardContent>
      </Card>

      {(isGenerating || streamContent) && (
        <Card className="border-white/5 bg-white/[0.02] mb-8">
          <CardContent className="p-6">
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto">
              {streamContent}
              {isGenerating && <span className="animate-pulse text-cyan-400">▋</span>}
            </pre>
          </CardContent>
        </Card>
      )}

      {prompts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {prompts.length} prompts generated
            </span>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> Copy all
            </button>
          </div>
          {prompts.map(prompt => (
            <Card key={prompt.id} className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-[10px] bg-cyan-400/10 text-cyan-400 border-cyan-400/20">
                    Clip {prompt.clipNumber}
                  </Badge>
                  <button
                    onClick={() => handleCopy(prompt.id, prompt.prompt)}
                    className="text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {copiedId === prompt.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {prompt.prompt}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isGenerating && prompts.length === 0 && !streamContent && (
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="text-center py-20">
            <Video className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Paste a script and generate Flow prompts</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
