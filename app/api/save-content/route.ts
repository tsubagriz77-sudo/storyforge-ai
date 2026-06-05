import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const allowedTables = ['characters', 'episodes', 'hooks'];

function getSupabase(token?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token ? {
      global: { headers: { Authorization: `Bearer ${token}` } }
    } : {}
  );
}

async function getUserId(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return { userId: null, supabase: getSupabase() };
  const token = authHeader.replace('Bearer ', '');
  const supabase = getSupabase(token);
  const { data } = await supabase.auth.getUser();
  return { userId: data.user?.id || null, supabase };
}

export async function POST(req: NextRequest) {
  const { userId, supabase } = await getUserId(req);
  if (!userId) return new Response('Non autorise', { status: 401 });

  const { table, data } = await req.json();

  if (!allowedTables.includes(table)) {
    return new Response('Table non autorisee', { status: 400 });
  }

  const { data: result, error } = await supabase
    .from(table)
    .insert([{ ...data, user_id: userId }])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(req: NextRequest) {
  const { userId, supabase } = await getUserId(req);
  if (!userId) return new Response('Non autorise', { status: 401 });

  const { table, id } = await req.json();

  if (!allowedTables.includes(table)) {
    return new Response('Table non autorisee', { status: 400 });
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}