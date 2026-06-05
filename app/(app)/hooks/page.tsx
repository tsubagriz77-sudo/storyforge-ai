'use client';

import { useState } from 'react';
import { Zap, Wand2, RefreshCw, Copy, Check, Target, Flame, TrendingUp, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Hook {
  id: string;
  content: string;
  hookType: string;
}

const hookTypes = [
  { id: 'opening', label: 'Opening Hook', icon: Target },
  { id: 'cliffhanger', label: 'Cliffhanger', icon: Flame },
  { id: 'plot_twist', label: 'Plot Twist', icon: TrendingUp },
  { id: 'emotional', label: 'Emotional', icon: Sparkles },
  { id: 'curiosity_gap', label: 'Curiosity', icon: Eye },
  { id: 'controversy', label: 'Controversy', icon: Zap },
];

export default function HooksPage() {
  const [hookType, setHookType] = useState('opening');
  const [context, setContext] = useState('');
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hookType, context }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const newHooks = data.hooks.map((content: string, i: number) => ({
        id: Date.now().toString() + i,
        content,
        hookType,
      }));
      setHooks(newHooks);
    } catch (e) {
      console.error(e);
    }

    setIsGenerating(false);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Viral TikTok Hooks</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate irresistible hooks that stop the scroll.</p>
      </div>

      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Series context (optional)</Label>
            <Textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. Two teens fall in love without knowing their families hate each other..."
              className="bg-white/5 border-white/10 min-h-[80px] resize-none"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-3 block">Hook type</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {hookTypes.map(({ id, label, icon: Icon }) => (
                <div
                  key={id}
                  onClick={() => setHookType(id)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                    hookType === id
                      ? 'border-cyan-500/30 bg-cyan-500/5'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${hookType === id ? 'text-cyan-400' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-medium"
          >
            {isGenerating ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" />Generate 5 hooks</>
            )}
          </Button>
        </CardContent>
      </Card>

      {hooks.length > 0 ? (
        <div className="space-y-4">
          {hooks.map(hook => (
            <Card key={hook.id} className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm leading-relaxed flex-1">{hook.content}</p>
                  <button
                    onClick={() => handleCopy(hook.id, hook.content)}
                    className="text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    {copiedId === hook.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="text-center py-20">
            <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Select a hook type and generate</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
