import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase-client';

const allowedTables = ['characters', 'episodes', 'hooks'];

async function getUserId(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data } = await supabase.auth.getUser(token);
  return data.user?.id || null;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
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
  const userId = await getUserId(req);
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
