// src/app/api/atlets/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
  // Verifikasi session dengan NextAuth
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { atlets: [], error: "Tidak terautentikasi." },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from("atlet")
    .select("id, nama_lengkap, kategori_kelas, url_pas_foto, url_foto_kk, user_id")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ atlets: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ atlets: data });
}
