// src/lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi.");
        }

        // Cari user di tabel users Supabase
        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("id, email, password, tipe_user, nama_lengkap, nama_kontingen")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("Email tidak ditemukan.");
        }

        // Verifikasi password dengan bcrypt
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Password salah.");
        }

        // Return objek user yang akan disimpan di token
        return {
          id: user.id,
          email: user.email,
          name: user.nama_lengkap,
          tipe_user: user.tipe_user,
          nama_kontingen: user.nama_kontingen,
        };
      },
    }),
  ],

  callbacks: {
    // Simpan data tambahan ke JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tipe_user = user.tipe_user;
        token.nama_kontingen = user.nama_kontingen;
        token.name = user.name;
      }
      return token;
    },
    // Teruskan data dari token ke session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.tipe_user = token.tipe_user;
        session.user.nama_kontingen = token.nama_kontingen;
        session.user.name = token.name;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 jam
  },

  secret: process.env.NEXTAUTH_SECRET,
};
