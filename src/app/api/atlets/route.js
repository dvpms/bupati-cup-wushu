import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Ambil userId dari query param (atau session/cookie jika sudah ada auth server)
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ atlets: [], error: 'userId diperlukan' }, { status: 400 });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await supabase
    .from('atlet')
    .select('id, nama_lengkap, kategori_kelas, url_pas_foto, url_foto_kk, user_id')
    .eq('user_id', userId);
  if (error) return NextResponse.json({ atlets: [], error: error.message }, { status: 500 });
  return NextResponse.json({ atlets: data });
}
