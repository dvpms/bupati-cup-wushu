import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// PENTING: Gunakan createClient dari '@supabase/supabase-js' di sini
// untuk bisa menggunakan service_role key.
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  const { atlet } = await request.json();

  // Inisialisasi Supabase client di server dengan Kunci Master (service_role)
  // Ini memberinya izin penuh untuk melakukan operasi administratif seperti menghapus file.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Gunakan service role key dari environment variables server
    { auth: { persistSession: false } }
  );

  try {
    // 1. Hapus file-file dari Storage (sekarang dengan izin penuh)
    if (atlet.url_pas_foto) {
      const pasFotoPath = atlet.url_pas_foto.split("/").pop(); // Cara lebih aman untuk mendapatkan nama file
      await supabaseAdmin.storage.from('pas_foto_atlet').remove([`${atlet.user_id}/${pasFotoPath}`]);
    }
    if (atlet.url_foto_kk) {
      const fotoKKPath = atlet.url_foto_kk.split("/").pop();
      await supabaseAdmin.storage.from('foto_kk').remove([`${atlet.user_id}/${fotoKKPath}`]);
    }

    // 2. Hapus data atlet dari database
    const { error: dbError } = await supabaseAdmin
      .from('atlet')
      .delete()
      .eq('id', atlet.id);

    if (dbError) throw dbError;

    return NextResponse.json({ message: 'Atlet berhasil dihapus' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
