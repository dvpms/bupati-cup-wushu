"use client";
import React, { useEffect, useState } from "react";
import SummaryCard from "@/components/admin/SummaryCard";
import { supabase } from "@/utils/supabaseClient";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    menunggu: 0,
    lunas: 0,
    totalPembayaran: 0,
    jumlahKontingen: 0,
    jumlahAtlet: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      // Fetch pembayaran stats
      const { data: pembayaranMenunggu, error: errorMenunggu } = await supabase
        .from("pembayaran")
        .select("id")
        .eq("status", "Menunggu Verifikasi");
      const { data: pembayaranLunas, error: errorLunas } = await supabase
        .from("pembayaran")
        .select("id, jumlah_transfer")
        .eq("status", "LUNAS");

      // Fetch total pembayaran lunas
      const totalPembayaran = pembayaranLunas
        ? pembayaranLunas.reduce((acc, cur) => acc + (cur.jumlah_transfer || 0), 0)
        : 0;

      // Fetch jumlah kontingen
      const { data: kontingen, error: errorKontingen } = await supabase
        .from("users")
        .select("id");

      // Fetch jumlah atlet
      const { data: atlet, error: errorAtlet } = await supabase
        .from("atlet")
        .select("id");

      setStats({
        menunggu: pembayaranMenunggu ? pembayaranMenunggu.length : 0,
        lunas: pembayaranLunas ? pembayaranLunas.length : 0,
        totalPembayaran,
        jumlahKontingen: kontingen ? kontingen.length : 0,
        jumlahAtlet: atlet ? atlet.length : 0,
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Panel kontrol untuk verifikasi pembayaran, kelola kontingen, dan atlet.
          </p>
        </header>
        {/* Komponen summary statistik, sidebar, dan tabel verifikasi pembayaran akan ditambahkan di sini */}
        <div className="w-full flex flex-col gap-6 mb-10">
          <div className="w-full flex gap-8">
            <SummaryCard color="yellow-500" value={stats.menunggu} label="Pembayaran Menunggu" className="flex-1" />
            <SummaryCard color="green-500" value={stats.lunas} label="Pembayaran Lunas" className="flex-1" />
            <SummaryCard color="blue-500" value={`Rp ${stats.totalPembayaran.toLocaleString()}`} label="Total Pembayaran" className="flex-[2]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SummaryCard color="purple-500" value={stats.jumlahKontingen} label="Jumlah Kontingen" />
            <SummaryCard color="pink-500" value={stats.jumlahAtlet} label="Jumlah Atlet" />
          </div>
        </div>
        {/* Hanya tampilkan summary cards, tanpa ringkasan verifikasi pembayaran */}
      </div>
    </div>
  );
}

// Komponen SummaryCard dipindahkan ke src/components/admin/SummaryCard.jsx
