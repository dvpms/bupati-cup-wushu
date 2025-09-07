"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaDownload } from "react-icons/fa";
import { supabase } from "@/utils/supabaseClient";
import * as XLSX from "xlsx";

const DatabasePeserta = () => {
  const [peserta, setPeserta] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua Kategori");
  const [filterKontingen, setFilterKontingen] = useState("Semua Kontingen");

  useEffect(() => {
    async function fetchPeserta() {
      // Ambil data atlet dan users
      const { data: atletRows, error: errAtlet } = await supabase
        .from("atlet")
        .select(`id, nama_lengkap, kategori_kelas, user_id, users(nama_kontingen)`);
      // Ambil semua pembayaran
      const { data: pembayaranRows, error: errPembayaran } = await supabase
        .from("pembayaran")
        .select("user_id, status");
      // Buat map status pembayaran per user_id
      const pembayaranMap = {};
      (pembayaranRows || []).forEach((p) => {
        pembayaranMap[p.user_id] = p.status;
      });
      // Map data peserta
      const rows = (atletRows || []).map((a) => ({
        id: a.id,
        nama: a.nama_lengkap,
        kontingen: a.users?.nama_kontingen || "-",
        kategori: a.kategori_kelas,
        status: pembayaranMap[a.user_id] || "-",
      }));
      setPeserta(rows);
    }
    fetchPeserta();
  }, []);

  async function handleExportExcel() {
    // Fetch all data from tabel atlet
    const { data: atletRows, error } = await supabase
      .from("atlet")
      .select("nama_lengkap, nik, kk, tempat_lahir, tanggal_lahir, kategori_kelas");
    if (!atletRows) return;
    // Format data for Excel
    const formatted = atletRows.map(a => ({
      "Nama Lengkap": a.nama_lengkap,
      "NIK": a.nik,
      "KK": a.kk,
      "Tempat Lahir": a.tempat_lahir,
      "Tanggal Lahir": a.tanggal_lahir,
      "Kategori Kelas": a.kategori_kelas,
    }));
    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(formatted);
    // Set column widths for neatness
    ws['!cols'] = [
      { wch: 22 }, // Nama Lengkap
      { wch: 18 }, // NIK
      { wch: 18 }, // KK
      { wch: 18 }, // Tempat Lahir
      { wch: 14 }, // Tanggal Lahir
      { wch: 22 }, // Kategori Kelas
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Peserta");
    XLSX.writeFile(wb, "peserta.xlsx");
  }

  // Filtered peserta
  const filteredPeserta = peserta.filter((p) => {
    const matchNama = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori === "Semua Kategori" || p.kategori === filterKategori;
    const matchKontingen = filterKontingen === "Semua Kontingen" || p.kontingen === filterKontingen;
    return matchNama && matchKategori && matchKontingen;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100 py-10 px-4 md:px-8">
      <div className="container mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-gray-800">Database Peserta</h1>
          <p className="text-gray-600 mt-2 text-lg">Cari, filter, dan kelola semua data atlet yang terdaftar.</p>
        </header>
        {/* Panel Aksi */}
        <section className="mb-8 p-6 bg-white rounded-xl border border-neutral-200 shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="search" className="text-xs font-medium text-gray-500">CARI NAMA ATLET</label>
              <input
                type="text"
                id="search"
                placeholder="Ketik nama..."
                className="mt-1 block w-full bg-neutral-100 border border-neutral-300 rounded-lg shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filter-category" className="text-xs font-medium text-gray-500">FILTER KATEGORI</label>
              <select
                id="filter-category"
                className="mt-1 block w-full bg-neutral-100 border border-neutral-300 rounded-lg shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={filterKategori}
                onChange={e => setFilterKategori(e.target.value)}
              >
                <option>Semua Kategori</option>
                {/* Generate kategori unik dari peserta */}
                {[...new Set(peserta.map(p => p.kategori))].map(kat => (
                  <option key={kat}>{kat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-contingent" className="text-xs font-medium text-gray-500">FILTER KONTINGEN</label>
              <select
                id="filter-contingent"
                className="mt-1 block w-full bg-neutral-100 border border-neutral-300 rounded-lg shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={filterKontingen}
                onChange={e => setFilterKontingen(e.target.value)}
              >
                <option>Semua Kontingen</option>
                {/* Generate kontingen unik dari peserta */}
                {[...new Set(peserta.map(p => p.kontingen))].map(kon => (
                  <option key={kon}>{kon}</option>
                ))}
              </select>
            </div>
            <div className="md:col-start-3 lg:col-start-4">
              <button
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                onClick={handleExportExcel}
              >
                <FaDownload className="me-2" /> Excel
              </button>
            </div>
          </div>
        </section>
        {/* Tabel Data Peserta */}
        <section className="bg-white rounded-xl border border-neutral-200 shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Atlet</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontingen Asal</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori Tanding</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredPeserta.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{p.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.kontingen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === "LUNAS" ? "bg-green-100 text-green-700" : p.status === "Menunggu Verifikasi" ? "bg-yellow-100 text-yellow-700" : p.status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/peserta/${p.id}`} className="text-purple-700 hover:text-purple-900">Lihat Detail</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DatabasePeserta;
