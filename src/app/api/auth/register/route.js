// src/app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      managerName,
      kontingenName,
      kontingenCity,
      kontingenProvince,
      managerWhatsapp,
    } = body;

    // Validasi input dasar
    if (!email || !password || !managerName || !kontingenName) {
      return NextResponse.json(
        { error: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user baru ke tabel users
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          nama_lengkap: managerName,
          nama_kontingen: kontingenName,
          tipe_user: "kontingen",
          kota: kontingenCity || null,
          provinsi: kontingenProvince || null,
          whatsapp: managerWhatsapp || null,
        },
      ])
      .select("id, email, nama_lengkap, nama_kontingen, tipe_user")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Gagal menyimpan data pengguna." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registrasi berhasil.", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
