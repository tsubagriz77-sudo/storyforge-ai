'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import {
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projects', label: 'Projets' },
  { href: '/characters', label: 'Characters' },
  { href: '/stories', label: 'Stories' },
  { href: '/episodes', label: 'Episodes' },
  { href: '/hooks', label: 'Hooks' },
  { href: '/prompts', label: 'Prompts' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              StoryForge<span className="gradient-text">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5 ${
                  pathname === link.href
                    ? 'text-white bg-white/5'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs max-w-[120px] truncate">{user.email}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Deconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-teal-400 text-white">
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/5 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'text-white bg-white/5'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 text-left"
                >
                  Deconnexion
                </button>
              ) : (
                <Link href="/auth/login" className="px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-400">
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
