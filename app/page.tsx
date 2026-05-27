'use client';

import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Users,
  BookOpen,
  Video,
  Play,
  ArrowRight,
  Star,
  TrendingUp,
  Wand2,
  Target,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Users,
    title: 'AI Character Generator',
    description: 'Create compelling characters with unique personalities, appearances, and voice styles in seconds.',
  },
  {
    icon: BookOpen,
    title: 'Story Generation',
    description: 'Generate engaging story arcs with premise, setting, and tone tailored for viral TikTok content.',
  },
  {
    icon: Zap,
    title: 'Episode Generator',
    description: 'Auto-generate episode scripts with hooks, cliffhangers, and pacing optimized for short-form video.',
  },
  {
    icon: Target,
    title: 'Viral TikTok Hooks',
    description: 'Craft irresistible opening hooks that stop the scroll and drive massive engagement.',
  },
  {
    icon: Video,
    title: 'AI Video Prompts',
    description: 'Generate precise prompts for AI video tools like Runway, Pika, and Kling to bring stories to life.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Track your series performance with insights on engagement, hooks, and audience retention.',
  },
];

const stats = [
  { value: '50K+', label: 'Series Created' },
  { value: '2M+', label: 'Episodes Generated' },
  { value: '500M+', label: 'Views Generated' },
  { value: '12K+', label: 'Creators' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'TikTok Creator, 2.4M followers',
    text: 'StoryForge AI completely transformed my content. My AI series gets 3x more engagement than anything else I post.',
  },
  {
    name: 'Marcus Rivera',
    role: 'Content Agency Owner',
    text: 'We went from creating 1 series a month to 5 a week. The character and story generation is insanely good.',
  },
  {
    name: 'Aisha Patel',
    role: 'Digital Storyteller',
    text: 'The TikTok hooks alone are worth it. My first 3 seconds retention went from 40% to 78%.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out AI series creation',
    features: ['3 characters', '2 stories', '10 episodes', 'Basic hooks', 'Community support'],
    cta: 'Get Started Free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For serious creators building viral content',
    features: ['Unlimited characters', 'Unlimited stories', 'Unlimited episodes', 'Advanced hooks', 'Video prompt generation', 'Priority support', 'Analytics dashboard'],
    cta: 'Start Pro Trial',
    featured: true,
  },
  {
    name: 'Agency',
    price: '$99',
    period: '/month',
    description: 'For teams and agencies at scale',
    features: ['Everything in Pro', 'Team collaboration', 'Brand voice presets', 'API access', 'Custom integrations', 'Dedicated account manager'],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[200px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Now generating 50K+ TikTok series worldwide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-slide-up">
            Generate Viral<br />
            <span className="gradient-text">TikTok AI Series</span><br />
            Automatically
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            From character creation to viral hooks, StoryForge AI handles every step of your
            TikTok AI series production. Create compelling content that stops the scroll.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-semibold px-8 h-12 glow">
                Start Creating Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5 h-12 px-8">
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground mb-4">
              <Wand2 className="w-3 h-3 text-cyan-400" />
              POWERED BY AI
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to create<br />
              <span className="gradient-text">viral AI series</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              One platform to go from idea to viral TikTok content. No writing experience needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-400/20 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[160px]" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              From idea to viral in <span className="gradient-text">3 steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Characters', desc: 'Define your cast with AI-powered personality and appearance generation.' },
              { step: '02', title: 'Build Your Story', desc: 'Generate story arcs, episodes, and hooks optimized for TikTok engagement.' },
              { step: '03', title: 'Produce Content', desc: 'Get video prompts for AI tools and publish your series to TikTok.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold gradient-text opacity-50 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Loved by <span className="gradient-text">creators</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-teal-400/5 rounded-full blur-[160px]" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-muted-foreground">Start free. Upgrade when you&apos;re ready to scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 ${
                  plan.featured
                    ? 'bg-gradient-to-b from-cyan-500/10 to-teal-400/5 border border-cyan-500/30 glow'
                    : 'border border-white/5 bg-white/[0.02]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button
                    className={`w-full ${
                      plan.featured
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-br from-cyan-500/10 via-teal-400/5 to-blue-500/10 border border-cyan-500/20 p-12 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-[80px]" />
            </div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Ready to create your first viral series?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join 12,000+ creators using StoryForge AI to dominate TikTok with AI-generated content.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-semibold px-8 h-12 glow">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-semibold">StoryForge AI</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Generate viral TikTok AI series automatically.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Product</h4>
              <div className="space-y-2">
                {['Characters', 'Stories', 'Hooks', 'Prompts'].map((l) => (
                  <Link key={l} href={`/${l.toLowerCase()}`} className="block text-sm text-muted-foreground hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Resources</h4>
              <div className="space-y-2">
                {['Blog', 'Tutorials', 'API Docs', 'Community'].map((l) => (
                  <span key={l} className="block text-sm text-muted-foreground hover:text-white transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Company</h4>
              <div className="space-y-2">
                {['About', 'Careers', 'Privacy', 'Terms'].map((l) => (
                  <span key={l} className="block text-sm text-muted-foreground hover:text-white transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">&copy; 2026 StoryForge AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Built for creators, by creators.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
