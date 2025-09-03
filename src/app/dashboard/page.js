"use client";

import { useEffect, useState } from "react";
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

  return (
    <div className="container mx-auto py-16 px-6 md:px-8 lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px]">
      <div className="bg-white rounded-xl shadow-md p-8">
        {session ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Halo, {session.user?.name || "Kontingen"}</h1>
            <p className="mt-2 text-gray-600">
              Selamat datang di dashboard {session.user?.kontingen ? (
                <strong className="text-gray-900">{session.user.kontingen}</strong>
              ) : (
                "kontingen"
              )}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/daftar/sukses" className="inline-flex items-center justify-center px-4 py-2 rounded-lg ring-1 ring-gray-300 text-gray-700 hover:bg-gray-50">
                Lihat Konfirmasi
              </Link>
              <button onClick={logout} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                Keluar
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Tidak ada sesi</h1>
            <p className="mt-2 text-gray-600">Silakan login terlebih dahulu.</p>
            <div className="mt-6">
              <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                Pergi ke Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
