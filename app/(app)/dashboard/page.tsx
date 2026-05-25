'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Zap,
  Video,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Clock,
  Sparkles,
  BarChart3,
  Eye,
  Heart,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statsCards = [
  { icon: Users, label: 'Characters', value: '12', change: '+3 this week', color: 'from-cyan-500/20 to-cyan-500/5' },
  { icon: BookOpen, label: 'Stories', value: '5', change: '+2 this week', color: 'from-teal-400/20 to-teal-400/5' },
  { icon: Zap, label: 'Episodes', value: '47', change: '+8 this week', color: 'from-emerald-400/20 to-emerald-400/5' },
  { icon: Video, label: 'Video Prompts', value: '23', change: '+5 this week', color: 'from-blue-400/20 to-blue-400/5' },
];

const recentActivity = [
  { type: 'character', label: 'Created character "Luna Shadow"', time: '2 hours ago', icon: Users },
  { type: 'story', label: 'Generated story "Neon Dreams"', time: '5 hours ago', icon: BookOpen },
  { type: 'episode', label: 'Added Episode 5 to "Neon Dreams"', time: '6 hours ago', icon: Zap },
  { type: 'hook', label: 'Generated 3 viral hooks', time: '1 day ago', icon: TrendingUp },
  { type: 'prompt', label: 'Created video prompt for Episode 4', time: '1 day ago', icon: Video },
];

const quickActions = [
  { href: '/characters', icon: Users, label: 'New Character', gradient: 'from-cyan-500 to-cyan-600' },
  { href: '/stories', icon: BookOpen, label: 'New Story', gradient: 'from-teal-400 to-teal-500' },
  { href: '/hooks', icon: Zap, label: 'Generate Hook', gradient: 'from-emerald-400 to-emerald-500' },
  { href: '/prompts', icon: Video, label: 'Video Prompt', gradient: 'from-blue-400 to-blue-500' },
];

export default function DashboardPage() {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here&apos;s your content overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 cursor-pointer">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <Plus className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-medium">{action.label}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat) => (
          <Card
            key={stat.label}
            className={`border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer ${
              hoveredStat === stat.label ? 'glow' : ''
            }`}
            onMouseEnter={() => setHoveredStat(stat.label)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-white/5 bg-white/[0.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Content Performance</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Avg. Views</span>
                </div>
                <span className="text-sm font-medium">45.2K</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-sm">Engagement</span>
                </div>
                <span className="text-sm font-medium">8.3%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">Shares</span>
                </div>
                <span className="text-sm font-medium">1.2K</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">Hook Score</span>
                </div>
                <span className="text-sm font-medium">92/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
