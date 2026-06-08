// src/app/api/kontingen/summary/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // Verifikasi sesi menggunakan NextAuth (server-side)
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Tidak terautentikasi. Silakan login kembali." },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  // Gunakan Supabase Admin client untuk operasi database
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

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

    const pembayaranPromise = supabaseAdmin
      .from("pembayaran")
      .select("jumlah_transfer")
      .eq("user_id", userId)
      .eq("status", "LUNAS");

    const [
      { data: userProfile, error: profileError },
      { data: daftarAtlet, error: atletError },
      { data: pembayaranList, error: pembayaranError },
    ] = await Promise.all([
      userProfilePromise,
      atletListPromise,
      pembayaranPromise,
    ]);

    if (profileError || atletError || pembayaranError) {
      const errors = { profileError, atletError, pembayaranError };
      console.error("Supabase query error:", errors);
      throw new Error("Gagal mengambil data dari database.");
    }

    let totalPembayaranDiterima = 0;
    if (pembayaranList) {
      totalPembayaranDiterima = pembayaranList.reduce(
        (sum, item) => sum + (item.jumlah_transfer || 0),
        0
      );
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
