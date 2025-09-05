"use client";
import Link from "next/link";
import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Panel kontrol untuk verifikasi pembayaran, kelola kontingen, dan
            atlet.
          </p>
        </header>
        {/* Komponen summary statistik, sidebar, dan tabel verifikasi pembayaran akan ditambahkan di sini */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
          {/* Card */}
          <SummaryCard
            color="yellow-500"
            value="2"
            label="Pembayaran Menunggu"
          />
          <SummaryCard color="green-500" value="1" label="Pembayaran Lunas" />
          <SummaryCard
            color="blue-500"
            value="Rp 2.000.246"
            label="Total Pembayaran"
          />
          <SummaryCard color="purple-500" value="8" label="Jumlah Kontingen" />
          <SummaryCard color="pink-500" value="54" label="Jumlah Atlet" />
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ringkasan Verifikasi Pembayaran
          </h2>
          <p className="text-gray-600 mb-4">
            Lihat detail dan aksi verifikasi pembayaran di menu
          </p>
          <Link href="/admin/verifikasi" className="text-blue-600 underline">
            Verifikasi Pembayaran
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ color, value, label }) {
  return (
    <div
      className={`bg-white rounded-xl shadow p-6 flex flex-col items-center transition hover:scale-[1.03] hover:shadow-lg`}
    >
      <span className={`text-5xl font-black text-${color} mb-2`}>{value}</span>
      <span className="text-lg font-semibold text-gray-700 text-center whitespace-pre-line">
        {label}
      </span>
    </div>
  );
}
