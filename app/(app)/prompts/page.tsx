'use client';

import { useState } from 'react';
import {
  Video,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  Camera,
  Film,
  Clapperboard,
  Palette,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VideoPrompt {
  id: string;
  promptText: string;
  toolType: string;
  style: string;
  sceneType: string;
}

const toolTypes = [
  { value: 'runway', label: 'Runway Gen-3', icon: Film },
  { value: 'pika', label: 'Pika Labs', icon: Clapperboard },
  { value: 'kling', label: 'Kling AI', icon: Camera },
  { value: 'sora', label: 'Sora', icon: Video },
  { value: 'midjourney', label: 'Midjourney', icon: Palette },
];

const styles = [
  'Cinematic', 'Anime', 'Photorealistic', 'Cyberpunk', 'Dark Fantasy',
  'Neon Noir', 'Vintage Film', 'Watercolor', '3D Render', 'Glitch Art',
];

const sceneTypes = [
  'Character Intro', 'Action Sequence', 'Emotional Moment', 'Reveal', 'Transition',
  'Establishing Shot', 'Dialogue Scene', 'Montage', 'Cliffhanger Ending',
];

function generatePrompt(toolType: string, style: string, sceneType: string): VideoPrompt {
  const promptsByScene: Record<string, string[]> = {
    'Character Intro': [
      `Cinematic close-up, ${style.toLowerCase()} style. A mysterious figure emerges from shadows, face half-lit by neon light. Slow dolly-in, dramatic lighting, shallow depth of field. Atmospheric haze, lens flare. The character turns to camera with an intense gaze. 4K quality, film grain, anamorphic bokeh.`,
      `${style} portrait shot. Character standing in rain, city lights reflecting off wet surfaces. Slow motion, camera circling the subject. Dramatic rim lighting, volumetric fog. Eyes glowing with determination. Cinematic color grading, teal and orange palette.`,
    ],
    'Action Sequence': [
      `Fast-paced ${style.toLowerCase()} action shot. Dynamic camera following subject through a collapsing environment. Explosions, debris, time-ramping slow motion to fast cuts. Volumetric lighting through dust particles. Wide angle lens distortion, intense motion blur on background elements. 4K, 60fps.`,
      `${style} style action scene. Overhead drone shot pulling into tight follow. Character leaping between structures, camera whip-pans to track movement. Particle effects, energy trails. Speed ramping from ultra-slow to real-time. Chromatic aberration on fast movements.`,
    ],
    'Emotional Moment': [
      `${style} emotional scene. Intimate close-up, single tear rolling down cheek. Soft natural light, shallow depth of field. Camera slowly pushing in, bokeh circles in background. Gentle color palette, muted tones with warm highlights. Subtle camera movement, breathing rhythm.`,
      `Tender ${style.toLowerCase()} moment. Two silhouettes against sunset, camera slowly orbiting. Golden hour lighting, long shadows, warm color temperature. Soft focus, dream-like quality. Lens breathing effect, organic camera movement. Emotional atmosphere, quiet intensity.`,
    ],
    'Reveal': [
      `${style} dramatic reveal. Camera positioned behind subject, slowly rising to reveal breathtaking landscape. Epic scale, atmospheric perspective. God rays breaking through clouds. Score builds as the world is revealed. Ultra-wide anamorphic shot, cinematic aspect ratio. 4K, HDR.`,
      `Slow ${style.toLowerCase()} reveal. Subject removes mask/hood, camera rack-focuses from background to face. Dramatic lighting change, color shift from cold to warm. Lens flare as true identity is revealed. Micro-expressions visible, subtle emotion. Cinematic depth.`,
    ],
    'Transition': [
      `${style} seamless transition. Camera pushes through a mirror/reflection into an alternate world. Reality dissolves into ${style.toLowerCase()} aesthetic. Morphing shapes, color transformation. Match-cut from one scene to another. Optical flow distortion, kaleidoscopic mid-point. Smooth 60fps.`,
      `Creative ${style} transition. Zoom into character's eye, dissolving into a new scene. Iris wipe, chromatic aberration on the edge. Scene transforms from one world to another. Particles scatter and reform. Seamless camera move bridging two environments.`,
    ],
    'Establishing Shot': [
      `Epic ${style} establishing shot. Sweeping aerial view of futuristic cityscape. Camera descending from clouds through atmospheric layers. Neon lights, flying vehicles, massive structures. Golden hour mixed with artificial city glow. Volumetric clouds, god rays. Ultra-wide, 4K.`,
      `${style} wide establishing shot. Desolate landscape, lone figure walking toward distant structure. Rule of thirds composition, negative space. Atmospheric haze, muted colors with single accent color. Slow camera drift, parallax in foreground elements. Cinematic aspect ratio.`,
    ],
    'Dialogue Scene': [
      `${style} dialogue scene. Over-the-shoulder alternating shots, shallow depth of field. Warm interior lighting, practical light sources. Characters' expressions clearly visible, subtle eye movements. Rack focus between speakers. Intimate framing, negative space for subtitles. 24fps film look.`,
      `Intimate ${style} conversation. Shot-reverse-shot pattern, gradually tightening framing. Lighting shifts subtly with emotional beats. Hands and gestures visible in frame. Shallow depth of field, warm tones. Camera subtly breathes with the scene's rhythm.`,
    ],
    'Montage': [
      `${style} montage sequence. Rapid cuts between different moments, time-lapse elements. Visual rhythm matching audio beats. Color grading shifts between scenes. Mix of close-ups and wide shots. Speed ramping, motion blur on transitions. Narrative progression through imagery. 4K.`,
      `Dynamic ${style} montage. Quick cuts showing character progression. Before/after contrasts, time passage indicators. Visual motifs connecting scenes. Variable speed, freeze frames on key moments. Music-synced editing rhythm. Particles and light leaks between cuts.`,
    ],
    'Cliffhanger Ending': [
      `${style} cliffhanger. Camera slowly pulling back as character makes a shocking discovery. Sound drops out. Final frame: character's expression frozen in disbelief. Hard cut to black. Last image lingers with afterimage effect. Dramatic lighting, high contrast. Cinematic final frame composition.`,
      `Suspenseful ${style} ending. Character reaches for something, camera extreme close-up on hand. Tension builds, camera slowly zooms. Just before contact - hard cut. Fade through white. Echo effect on last sound. Final frame: ambiguous visual, open to interpretation. Cinematic letterbox.`,
    ],
  };

  const scenePrompts = promptsByScene[sceneType] || promptsByScene['Character Intro'];
  const promptText = scenePrompts[Math.floor(Math.random() * scenePrompts.length)];

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    promptText,
    toolType,
    style,
    sceneType,
  };
}

export default function PromptsPage() {
  const [toolType, setToolType] = useState('runway');
  const [style, setStyle] = useState('Cinematic');
  const [sceneType, setSceneType] = useState('Character Intro');
  const [customContext, setCustomContext] = useState('');
  const [prompts, setPrompts] = useState<VideoPrompt[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPrompt = generatePrompt(toolType, style, sceneType);
      if (customContext.trim()) {
        newPrompt.promptText = `${newPrompt.promptText} Context: ${customContext.trim()}`;
      }
      setPrompts((prev) => [newPrompt, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedTool = toolTypes.find((t) => t.value === toolType);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">AI Video Prompts</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate precise prompts for AI video tools to bring your stories to life.</p>
      </div>

      {/* Tool Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {toolTypes.map((tool) => (
          <div
            key={tool.value}
            onClick={() => setToolType(tool.value)}
            className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 text-center ${
              toolType === tool.value
                ? 'border-cyan-500/30 bg-cyan-500/5'
                : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
            }`}
          >
            <tool.icon className={`w-5 h-5 mx-auto mb-1.5 ${toolType === tool.value ? 'text-cyan-400' : 'text-muted-foreground'}`} />
            <span className="text-xs font-medium block">{tool.label}</span>
          </div>
        ))}
      </div>

      {/* Generator Controls */}
      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Scene Type</Label>
              <Select value={sceneType} onValueChange={setSceneType}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sceneTypes.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-4">
            <Label className="text-xs text-muted-foreground mb-2 block">Additional Context (optional)</Label>
            <Textarea
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="Add character names, specific details, or story context..."
              className="bg-white/5 border-white/10 min-h-[80px] resize-none"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-medium"
          >
            {isGenerating ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" />Generate Video Prompt</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Prompts */}
      {prompts.length > 0 ? (
        <div className="space-y-4">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {prompts.length} Prompts Generated
          </span>
          {prompts.map((prompt) => {
            const tool = toolTypes.find((t) => t.value === prompt.toolType);
            return (
              <Card key={prompt.id} className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      {tool && <tool.icon className="w-4 h-4 text-cyan-400" />}
                      <Badge variant="secondary" className="text-[10px] bg-cyan-400/10 text-cyan-400 border-cyan-400/20">
                        {tool?.label || prompt.toolType}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">
                        {prompt.style}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">
                        {prompt.sceneType}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-white flex-shrink-0"
                      onClick={() => handleCopy(prompt.id, prompt.promptText)}
                    >
                      {copiedId === prompt.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5 font-mono text-xs">
                    {prompt.promptText}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-1">No prompts generated yet</p>
            <p className="text-xs text-muted-foreground">Select a tool, style, and scene type to generate video prompts</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
