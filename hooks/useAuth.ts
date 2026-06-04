import { supabase } from '@/lib/supabase-client';

export async function getAuthHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
}
