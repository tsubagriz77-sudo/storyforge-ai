'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return;
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caracteres');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://storyforge-ai-kohl.vercel.app/auth/callback',
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verifie ton email</h1>
          <p className="text-muted-foreground text-sm">
            Un lien de confirmation a ete envoye a <strong className="text-white">{email}</strong>.
            Clique dessus pour activer ton compte.
          </p>
          <Link href="/auth/login" className="inline-block mt-6 text-cyan-400 hover:text-cyan-300 text-sm">
            Retour a la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Inscription</h1>
          <p className="text-muted-foreground text-sm mt-2">Cree ton compte StoryForge AI</p>
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
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
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
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-muted-foreground outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            onClick={handleSignup}
            disabled={loading || !email || !password}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Inscription...' : 'Creer mon compte'}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Deja un compte ?{' '}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
              Connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
