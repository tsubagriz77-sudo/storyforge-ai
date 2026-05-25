'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Zap,
  Video,
  Sparkles,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/characters', label: 'Characters', icon: Users },
  { href: '/stories', label: 'Stories', icon: BookOpen },
  { href: '/hooks', label: 'TikTok Hooks', icon: Zap },
  { href: '/prompts', label: 'Video Prompts', icon: Video },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r border-white/5 bg-sidebar pt-6 px-3">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center glow">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight">
          StoryForge<span className="gradient-text">AI</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-white/5 text-white'
                  : 'text-sidebar-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon
                className={`w-4.5 h-4.5 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-muted-foreground group-hover:text-cyan-400'
                }`}
              />
              {link.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 py-6">
        <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-400/10 border border-cyan-500/20 p-4">
          <p className="text-xs font-medium text-white mb-1">Pro Plan</p>
          <p className="text-xs text-muted-foreground mb-3">Unlock unlimited generations</p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 px-3 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </aside>
  );
}
