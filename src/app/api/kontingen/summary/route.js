import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Masih dibutuhkan untuk fallback atau operasi lain

// PERBAIKAN FINAL: Kita akan menggunakan Authorization header untuk autentikasi
// Ini adalah metode yang paling andal dan menghindari masalah caching Next.js.
export const dynamic = "force-dynamic";

export async function GET(request) {
  // Langkah 1: Ambil "kartu identitas" (access token) dari header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Header Authorization tidak ada atau formatnya salah" },
      { status: 401 }
    );
  }
  const token = authHeader.split("Bearer ")[1];

  // Langkah 2: Gunakan Supabase Admin Client untuk memverifikasi kartu identitas
  // Kita perlu menggunakan service_role key di sini agar server bisa memvalidasi token apapun.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json(
      { error: "Token tidak valid atau sesi kedaluwarsa" },
      { status: 401 }
    );
  }

  // Jika token valid, kita mendapatkan user yang aman. Inilah sumber kebenaran kita.
  const userId = user.id;

  // Mulai dari sini, semua kode sama persis karena kita sudah memiliki userId yang terpercaya.
  try {
    const userProfilePromise = supabaseAdmin
      .from("users")
      .select("nama_lengkap, nama_kontingen, email")
      .eq("id", userId)
      .single();

    const atletListPromise = supabaseAdmin
      .from("atlet")
      .select("id, nama_lengkap, kategori_kelas, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    const totalPembayaranPromise = supabaseAdmin.rpc(
      "get_total_pembayaran_by_user",
      { p_user_id: userId }
    );

    const [
      { data: userProfile, error: profileError },
      { data: daftarAtlet, error: atletError },
      { data: totalPembayaranDiterima, error: pembayaranError },
    ] = await Promise.all([
      userProfilePromise,
      atletListPromise,
      totalPembayaranPromise,
    ]);

    if (profileError || atletError || pembayaranError) {
      const errors = { profileError, atletError, pembayaranError };
      console.error("Supabase query error:", errors);
      throw new Error("Gagal mengambil data dari database.");
    }

    const jumlahAtlet = daftarAtlet ? daftarAtlet.length : 0;
    const totalTagihan = jumlahAtlet * 70000;
    const sisaTagihan = totalTagihan - (totalPembayaranDiterima || 0);

    let runningTagihan = 0;
    const atletDenganStatus = (daftarAtlet || []).map((atlet) => {
      runningTagihan += 70000;
      const status =
        (totalPembayaranDiterima || 0) >= runningTagihan
          ? "LUNAS"
          : "BELUM LUNAS";
      return {
        ...atlet,
        status,
      };
    });

    return NextResponse.json({
      profile: userProfile,
      summary: {
        totalAtlet: jumlahAtlet,
        totalTagihan,
        totalDibayar: totalPembayaranDiterima || 0,
        sisaTagihan,
      },
      daftarAtlet: atletDenganStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
