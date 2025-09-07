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
        <div className="w-full flex flex-col gap-6 mb-10">
          <div className="w-full flex gap-8">
            <SummaryCard color="yellow-500" value="2" label="Pembayaran Menunggu" className="flex-1" />
            <SummaryCard color="green-500" value="1" label="Pembayaran Lunas" className="flex-1" />
            <SummaryCard color="blue-500" value="Rp 2.000.246" label="Total Pembayaran" className="flex-[2]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SummaryCard color="purple-500" value="8" label="Jumlah Kontingen" />
            <SummaryCard color="pink-500" value="54" label="Jumlah Atlet" />
          </div>
        </div>
  {/* Hanya tampilkan summary cards, tanpa ringkasan verifikasi pembayaran */}
      </div>
    </div>
  );
}

function SummaryCard({ color, value, label, className }) {
  return (
    <div
      className={`w-full min-h-[120px] bg-white rounded-2xl shadow flex flex-col items-center justify-center px-4 py-6 transition hover:scale-[1.03] hover:shadow-xl border border-gray-100 overflow-hidden ${className || ''}`}
    >
      <span
        className={`font-extrabold text-${color} mb-2 text-center truncate w-full`}
        style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
        }}
      >
        {value}
      </span>
      <span
        className="font-semibold text-gray-700 text-center break-words w-full truncate"
        style={{
          fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
