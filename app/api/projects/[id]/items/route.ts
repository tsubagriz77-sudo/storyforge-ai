import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
