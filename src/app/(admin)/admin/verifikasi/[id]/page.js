"use client";
import Image from "next/image";
import React from "react";
import RincianTagihan from "@/components/RincianTagihan";

export default function DetailVerifikasiPembayaranPage() {
  // Dummy data
  const pembayaran = {
    id: 1,
    kontingen: "Naga Api",
    jumlahAtlet: 5,
    biayaPerAtlet: 70000,
    kodeUnik: 123,
    totalTagihan: 351123, // (5 * 70000) + 123
    buktiTransfer: "/bukti-transfer.jpg",
    jumlahTransfer: 351123,
    status: "Menunggu Verifikasi",
    waktuKonfirmasi: "29 Agu 2025, 14:30",
  };
  const subtotal = pembayaran.jumlahAtlet * pembayaran.biayaPerAtlet;
  const total = subtotal + pembayaran.kodeUnik;
  const formatRupiah = (num) => num.toLocaleString("id-ID");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-10 md:px-8 max-w-2xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
              Detail Verifikasi Pembayaran
            </h1>
            <p className="text-gray-600">
              Cek detail pembayaran dan lakukan verifikasi.
            </p>
          </header>
          <div className="bg-white rounded-xl shadow p-8 border border-neutral-200">
            <RincianTagihan
              invoice={pembayaran}
              subtotal={subtotal}
              total={total}
              formatRupiah={formatRupiah}
            />
            <div className="mb-6">
              <div className="mb-2 text-gray-700 font-semibold">
                Bukti Transfer
              </div>
              <Image
                src={pembayaran.buktiTransfer}
                alt="Bukti Transfer"
                width={500}
                height={300}
                className="rounded-lg border w-full max-w-xs"
              />
              <div className="mt-2 text-gray-600 text-sm">
                Jumlah transfer:{" "}
                <span className="font-bold text-gray-800">
                  Rp {pembayaran.jumlahTransfer.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mb-6">
              <div className="mb-2 text-gray-700 font-semibold">
                Status Verifikasi
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                {pembayaran.status}
              </span>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition">
                Setujui
              </button>
              <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition">
                Tolak
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
