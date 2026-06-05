import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase(token?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token ? {
      global: { headers: { Authorization: `Bearer ${token}` } }
    } : {}
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const supabase = getSupabase(token);

  const projectId = params.id;

  const [characters, episodes, hooks] = await Promise.all([
    supabase.from('characters').select('*').eq('project_id', projectId).order('created_at'),
    supabase.from('episodes').select('*').eq('project_id', projectId).order('number'),
    supabase.from('hooks').select('*').eq('project_id', projectId).order('created_at'),
  ]);

  return new Response(JSON.stringify({
    characters: characters.data || [],
    episodes: episodes.data || [],
    hooks: hooks.data || [],
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}