"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiArrowLeftCircle } from "react-icons/fi";

export default function DetailAtletPage() {
  "use client";
  const searchParams = useSearchParams();
  const atletId = searchParams.get("id");
  // Dummy data, ganti dengan data asli dari state/API
  const atlet = {
    fullName: "Budi Santoso",
    nik: "1234567890123456",
    kk: "6543210987654321",
    birthPlace: "Tangerang",
    birthDate: "05-12-2004",
    kategoriKelas: "Sanda Putra Junior",
    pasFoto: null,
    fotoKK: null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-purple-700 font-medium"
          >
            <FiArrowLeftCircle className="mr-2" /> Kembali
          </Link>
        </div>
        <div className="w-full max-w-2xl bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-300 mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Detail Atlet
          </h1>
          <div className="space-y-6">
            <div>
              <span className="block text-sm text-gray-500">Nama Lengkap</span>
              <span className="block text-lg font-semibold text-gray-800">
                {atlet.fullName}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm text-gray-500">NIK</span>
                <span className="block text-lg font-semibold text-gray-800">
                  {atlet.nik}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Nomor KK</span>
                <span className="block text-lg font-semibold text-gray-800">
                  {atlet.kk}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm text-gray-500">
                  Tempat Lahir
                </span>
                <span className="block text-lg font-semibold text-gray-800">
                  {atlet.birthPlace}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">
                  Tanggal Lahir
                </span>
                <span className="block text-lg font-semibold text-gray-800">
                  {atlet.birthDate}
                </span>
              </div>
            </div>
            <div>
              <span className="block text-sm text-gray-500">
                Kategori & Kelas
              </span>
              <span className="block text-lg font-semibold text-gray-800">
                {atlet.kategoriKelas}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm text-gray-500">Pas Foto</span>
                {atlet.pasFoto ? (
                  <Image
                    src={atlet.pasFoto}
                    alt="Pas Foto"
                    className="mt-2 rounded-lg border w-32 h-40 object-cover"
                  />
                ) : (
                  <span className="block text-gray-400 italic mt-2">
                    Belum diupload
                  </span>
                )}
              </div>
              <div>
                <span className="block text-sm text-gray-500">Foto KK</span>
                {atlet.fotoKK ? (
                  <Image
                    src={atlet.fotoKK}
                    alt="Foto KK"
                    className="mt-2 rounded-lg border w-32 h-40 object-cover"
                  />
                ) : (
                  <span className="block text-gray-400 italic mt-2">
                    Belum diupload
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={`/dashboard/edit-atlet?id=${atletId}`}
              className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition"
            >
              Edit Data Atlet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
