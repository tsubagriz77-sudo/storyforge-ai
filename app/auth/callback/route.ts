import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return Response.redirect(new URL('/dashboard', req.url));
}
