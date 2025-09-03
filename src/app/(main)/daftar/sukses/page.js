"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

export default function DaftarSuksesPage() {
  const [result, setResult] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("registrationResult");
      if (raw) setResult(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <div className="container mx-auto py-16 px-6 md:px-8 lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px]">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <FaCheckCircle className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Pendaftaran Berhasil Dibuat</h1>
        <p className="mt-2 text-gray-600">
          {result ? (
            <>Akun untuk <strong className="text-gray-900">{result.kontingenName}</strong> berhasil dibuat. Anda bisa login dan melanjutkan ke dashboard.</>
          ) : (
            <>Akun berhasil dibuat. Silakan login untuk melanjutkan ke dashboard.</>
          )}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700">
            Pergi ke Login
          </Link>
          <Link href="/" className="inline-flex items-center justify-center px-5 py-3 rounded-lg ring-1 ring-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
