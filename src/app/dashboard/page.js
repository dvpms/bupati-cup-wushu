"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("session");
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem("session");
    } catch {}
    router.push("/");
  };

  if (!session) {
    return (
      <div className="container mx-auto py-16 px-6 md:px-8 lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px]">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Tidak ada sesi</h1>
          <p className="mt-2 text-gray-600">Silakan login terlebih dahulu.</p>
          <div className="mt-6">
            <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              Pergi ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const name = session.user?.name || "Kontingen";
  const kontingen = session.user?.kontingen;

  return (
    <div className="container mx-auto py-16 px-6 md:px-8 lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px]">
      {/* Welcome + quick actions */}
      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800">Selamat datang, {name}</h1>
          <p className="mt-1 text-gray-600">
            {kontingen ? (
              <>Anda sedang mengelola kontingen <strong className="text-gray-900">{kontingen}</strong>.</>
            ) : (
              <>Lengkapi data kontingen Anda untuk mulai pendaftaran atlet.</>
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/daftar/sukses" className="inline-flex items-center justify-center px-4 py-2 rounded-lg ring-1 ring-gray-300 text-gray-700 hover:bg-gray-50">
              Lihat Konfirmasi
            </Link>
            <Link href="#" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              Tambah Atlet (mock)
            </Link>
            <button onClick={logout} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200">
              Keluar
            </button>
          </div>
        </section>

        {/* Kontingen summary */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800">Ringkasan Kontingen</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Jumlah Atlet</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">—</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Status Pembayaran</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">—</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Kategori Diikuti</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </section>

        {/* Atlet list placeholder */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Atlet</h2>
            <button className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              Tambah Atlet
            </button>
          </div>
          <p className="mt-4 text-gray-600">Belum ada data atlet. Mulai dengan menambahkan atlet pertama Anda.</p>
        </section>
      </div>
    </div>
  );
}
