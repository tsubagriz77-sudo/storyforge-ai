'use client';

import { useState } from 'react';
import {
  Zap,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Target,
  Flame,
  Sparkles,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Hook {
  id: string;
  content: string;
  hookType: string;
  engagementScore: number;
  category: string;
}

const hookTypes = ['opening', 'cliffhanger', 'plot_twist', 'emotional', 'controversial', 'curiosity_gap'];
const categories = ['Drama', 'Thriller', 'Sci-Fi', 'Fantasy', 'Romance', 'Horror', 'Comedy', 'Action'];

function generateHooks(hookType: string, category: string): Hook[] {
  const hookTemplates: Record<string, string[]> = {
    opening: [
      `POV: You just discovered your best friend has been living a double life... and you're the other side of it.`,
      `What if I told you the person you trust most has been lying to you since the day you met?`,
      `Nobody talks about what really happens when you dig too deep into your own memories...`,
      `The last message she sent was a location. The coordinates led to a place that doesn't exist on any map.`,
      `He said "don't come after me." But he didn't say don't look.`,
    ],
    cliffhanger: [
      `She opened the door and froze. Standing there was someone who died three years ago.`,
      `The screen flickered one last time. The message read: "I know you're reading this."`,
      `Just as he was about to confess everything, the lights went out. When they came back on, she was gone.`,
      `The test came back positive. But not for what anyone expected.`,
      `He finally found the truth. But the truth was wearing his face.`,
    ],
    plot_twist: [
      `The villain wasn't the one in the shadows. It was the one holding the flashlight.`,
      `Everyone thought she was running from something. She was actually running TOWARD it.`,
      `The prophecy wasn't wrong. They just misread who the chosen one was.`,
      `The AI didn't go rogue. It followed its programming perfectly. That's what makes it terrifying.`,
      `He didn't lose his memory. He chose to forget. And now you'll understand why.`,
    ],
    emotional: [
      `Some people carry their trauma silently. She carried hers in a song that nobody could hear but everyone could feel.`,
      `The hardest part wasn't losing everything. It was pretending he still had something to lose.`,
      `She said goodbye every day for a year before she actually left. Nobody noticed until it was too late.`,
      `They told him to move on. But how do you move on from something that's still happening?`,
      `The letter sat unopened for 10 years. When he finally read it, he wished he hadn't.`,
    ],
    controversial: [
      `Hot take: The "good guy" in every story is actually the most dangerous character.`,
      `Unpopular opinion: We don't need heroes. We need people brave enough to be villains for the right reasons.`,
      `Everyone says "trust your gut." Your gut has been wrong more times than you want to admit.`,
      `The most toxic relationship isn't between two people. It's between you and the version of yourself you pretend to be.`,
      `We celebrate resilience but never question what forces people to be resilient in the first place.`,
    ],
    curiosity_gap: [
      `Scientists found something at the bottom of the ocean. They classified it immediately. Here's what we know.`,
      `There's a building in every city that nobody enters. Once you learn why, you'll never look at cities the same.`,
      `A study just revealed that 90% of people experience this phenomenon but fewer than 1% can name it.`,
      `There are exactly 3 rules that every survivor follows. The first one will change how you see everything.`,
      `The average person walks past 17 cameras a day. But there's one camera nobody can find. Until now.`,
    ],
  };

  const templates = hookTemplates[hookType] || hookTemplates.opening;
  return templates.map((content, i) => ({
    id: Date.now().toString() + i.toString(),
    content,
    hookType,
    engagementScore: 70 + Math.floor(Math.random() * 30),
    category,
  }));
}

const hookTypeLabels: Record<string, string> = {
  opening: 'Opening Hook',
  cliffhanger: 'Cliffhanger',
  plot_twist: 'Plot Twist',
  emotional: 'Emotional',
  controversial: 'Controversial',
  curiosity_gap: 'Curiosity Gap',
};

const hookTypeIcons: Record<string, typeof Zap> = {
  opening: Target,
  cliffhanger: Flame,
  plot_twist: TrendingUp,
  emotional: Sparkles,
  controversial: Zap,
  curiosity_gap: Eye,
};

export default function HooksPage() {
  const [hookType, setHookType] = useState('opening');
  const [category, setCategory] = useState('Drama');
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newHooks = generateHooks(hookType, category);
      setHooks(newHooks);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 80) return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Viral TikTok Hooks</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate scroll-stopping hooks that drive massive engagement on TikTok.</p>
      </div>

      {/* Generator Controls */}
      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Hook Type</Label>
              <Select value={hookType} onValueChange={setHookType}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hookTypes.map((t) => (
                    <SelectItem key={t} value={t}>{hookTypeLabels[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
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
                  <><Wand2 className="w-4 h-4 mr-2" />Generate Hooks</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hook Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {hookTypes.slice(0, 6).map((type) => {
          const Icon = hookTypeIcons[type];
          return (
            <div
              key={type}
              onClick={() => setHookType(type)}
              className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                hookType === type
                  ? 'border-cyan-500/30 bg-cyan-500/5'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${hookType === type ? 'text-cyan-400' : 'text-muted-foreground'}`} />
                <span className="text-xs font-medium">{hookTypeLabels[type]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generated Hooks */}
      {hooks.length > 0 ? (
        <div className="space-y-4">
          {hooks.map((hook) => (
            <Card key={hook.id} className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{hook.content}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">
                        {hookTypeLabels[hook.hookType]}
                      </Badge>
                      <Badge variant="secondary" className={`text-[10px] ${getScoreColor(hook.engagementScore)}`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {hook.engagementScore}/100
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => handleCopy(hook.id, hook.content)}
                  >
                    {copiedId === hook.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-1">No hooks generated yet</p>
            <p className="text-xs text-muted-foreground">Select a hook type and click generate to create viral hooks</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
