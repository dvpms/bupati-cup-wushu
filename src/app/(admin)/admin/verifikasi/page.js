"use client";
import React from "react";
import Link from "next/link";

export default function VerifikasiPembayaranPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-10 md:px-8">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-gray-800">
              Verifikasi Pembayaran
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Tinjau dan setujui pembayaran yang masuk dari seluruh kontingen.
            </p>
          </header>
          {/* Kartu Status Cepat */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <StatusCard color="yellow" title="VERIFIKASI TERTUNDA" value={12} />
            <StatusCard color="green" title="PEMBAYARAN LUNAS" value={45} />
            <StatusCard color="red" title="PEMBAYARAN DITOLAK" value={2} />
          </section>
          {/* Tabel Verifikasi */}
          <section className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Antrean Verifikasi
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nama Kontingen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Jumlah Atlet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Tagihan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Waktu Konfirmasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Bukti
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {/* Contoh Baris Data */}
                  <VerifikasiRow
                    id={1}
                    namaKontingen="Kontingen Naga Api"
                    tagihan="Rp 500.123"
                    jumlahAtlet={5}
                    waktu="29 Agu 2025, 14:30"
                  />
                  <VerifikasiRow
                    id={2}
                    namaKontingen="Sasana Harimau Putih"
                    tagihan="Rp 1.250.456"
                    jumlahAtlet={8}
                    waktu="29 Agu 2025, 11:15"
                  />
                  {/* Baris data lainnya akan muncul di sini */}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatusCard({ color, title, value }) {
  const colorMap = {
    yellow: {
      border: "border-yellow-200",
      text: "text-yellow-600",
      value: "text-yellow-500",
      bg: "bg-white",
    },
    green: {
      border: "border-green-200",
      text: "text-green-600",
      value: "text-green-500",
      bg: "bg-white",
    },
    red: {
      border: "border-red-200",
      text: "text-red-600",
      value: "text-red-500",
      bg: "bg-white",
    },
  };
  const c = colorMap[color];
  return (
    <div className={`p-6 rounded-xl shadow border ${c.border} ${c.bg}`}>
      <h3 className={`text-sm font-semibold ${c.text}`}>{title}</h3>
      <p className={`text-4xl font-black mt-2 ${c.value}`}>{value}</p>
    </div>
  );
}

function VerifikasiRow({ id, namaKontingen, tagihan, waktu, jumlahAtlet }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
        <Link
          href={`/admin/verifikasi/${id}`}
          className="hover:underline text-purple-700"
        >
          {namaKontingen}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
        {jumlahAtlet}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
        {tagihan}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {waktu}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <a
          href="#"
          target="_blank"
          className="text-purple-600 hover:text-purple-800 hover:underline font-semibold"
        >
          Lihat Bukti
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
        <Link href={`/admin/verifikasi/${id}`}>
          {/* <button className="px-4 py-2 rounded-lg bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition shadow-sm">Lihat Detail</button> */}
        </Link>
        <button className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-bold hover:bg-green-100 transition shadow-sm">
          Setujui
        </button>
        <button className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100 transition shadow-sm">
          Tolak
        </button>
      </td>
    </tr>
  );
}
