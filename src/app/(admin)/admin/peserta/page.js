"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaDownload } from "react-icons/fa";

export default function DataPesertaAdminPage() {
  // Dummy data peserta
  const peserta = [
    {
      id: 1,
      nama: "Budi Santoso",
      kontingen: "Kontingen Naga Api",
      kategori: "Sanda - Junior - 50kg Putra",
      status: "LUNAS",
    },
    {
      id: 2,
      nama: "Citra Lestari",
      kontingen: "Sasana Harimau Putih",
      kategori: "Taolu - Senior - Tangan Kosong",
      status: "Menunggu Verifikasi",
    },
  ];

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
              <input type="text" id="search" placeholder="Ketik nama..." className="mt-1 block w-full bg-neutral-100 border border-neutral-300 rounded-lg shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="filter-category" className="text-xs font-medium text-gray-500">FILTER KATEGORI</label>
              <select id="filter-category" className="mt-1 block w-full bg-neutral-100 border border-neutral-300 rounded-lg shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option>Semua Kategori</option>
                <option>Sanda - Junior - 50kg Putra</option>
                <option>Taolu - Senior - Tangan Kosong</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-contingent" className="text-xs font-medium text-gray-500">FILTER KONTINGEN</label>
              <select id="filter-contingent" className="mt-1 block w-full bg-neutral-100 border border-neutral-300 rounded-lg shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option>Semua Kontingen</option>
                <option>Kontingen Naga Api</option>
                <option>Sasana Harimau Putih</option>
              </select>
            </div>
            <div className="md:col-start-3 lg:col-start-4">
              <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
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
                {peserta.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{p.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.kontingen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === "LUNAS" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span>
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
}
