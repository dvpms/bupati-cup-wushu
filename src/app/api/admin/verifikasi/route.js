import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  // Verifikasi hanya admin yang boleh akses
  if (!session || session.user?.tipe_user !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const [
      { data: menunggu },
      { data: lunas },
      { data: ditolak },
      { data: pembayaranRows, error: errRows },
      { data: atletRows }
    ] = await Promise.all([
      supabaseAdmin.from("pembayaran").select("id").eq("status", "Menunggu Verifikasi"),
      supabaseAdmin.from("pembayaran").select("id").eq("status", "LUNAS"),
      supabaseAdmin.from("pembayaran").select("id").eq("status", "Ditolak"),
      supabaseAdmin.from("pembayaran").select("id, user_id, jumlah_transfer, waktu_konfirmasi, bukti_url, status, users!pembayaran_user_id_fkey(nama_kontingen), catatan_admin"),
      supabaseAdmin.from("atlet").select("user_id")
    ]);

    if (errRows) throw errRows;

    return NextResponse.json({
      statusCount: {
        tertunda: menunggu ? menunggu.length : 0,
        lunas: lunas ? lunas.length : 0,
        ditolak: ditolak ? ditolak.length : 0,
      },
      pembayaranRows: pembayaranRows || [],
      atletRows: atletRows || []
    });
  } catch (error) {
    console.error("Gagal fetch data admin verifikasi:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.tipe_user !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { id, status, catatan_admin } = await request.json();
    
    const updateObj = { status };
    if (catatan_admin !== undefined) {
      updateObj.catatan_admin = catatan_admin;
    }

    const { error } = await supabaseAdmin
      .from("pembayaran")
      .update(updateObj)
      .eq("id", id);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gagal update status pembayaran:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
