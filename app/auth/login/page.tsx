'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-muted-foreground text-sm mt-2">Accede a ton espace StoryForge AI</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>
          )}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="ton@email.com"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-muted-foreground outline-none focus:border-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-muted-foreground outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">
              Inscription
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
