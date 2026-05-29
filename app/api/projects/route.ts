import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  const { title, pitch, bible } = await req.json();

  const { data, error } = await supabase
    .from('projects')
    .insert([{ title, pitch, bible }])
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
