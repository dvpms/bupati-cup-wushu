// src/app/api/delete-atlet/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  // Verifikasi session dengan NextAuth
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 }
    );
  }

  const { atlet } = await request.json();

  if (!atlet?.id) {
    return NextResponse.json({ error: "ID atlet tidak valid." }, { status: 400 });
  }

  // Gunakan service role key untuk operasi administratif (hapus file di storage)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  try {
    // 1. Hapus file dari Storage
    if (atlet.url_pas_foto) {
      const pasFotoPath = atlet.url_pas_foto.split("/").pop();
      await supabaseAdmin.storage
        .from("pas_foto_atlet")
        .remove([`${atlet.user_id}/${pasFotoPath}`]);
    }
    if (atlet.url_foto_kk) {
      const fotoKKPath = atlet.url_foto_kk.split("/").pop();
      await supabaseAdmin.storage
        .from("foto_kk")
        .remove([`${atlet.user_id}/${fotoKKPath}`]);
    }

    // 2. Hapus data atlet dari database
    const { error: dbError } = await supabaseAdmin
      .from("atlet")
      .delete()
      .eq("id", atlet.id);

    if (dbError) throw dbError;

    return NextResponse.json({ message: "Atlet berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
