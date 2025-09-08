"use client";
import { STYLE } from "@/config/style";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaMoneyCheckAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { RiProhibited2Line } from "react-icons/ri";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import React from "react";
import Swal from "sweetalert2";
import { showLoadingSwal, closeSwal } from "@/utils/loadingSwal";

export default function AthletesTable({ atlets }) {
  // Deadline logic
  const now = new Date();
  const deadline = new Date("2025-10-07T23:59:59");
  const isAfterDeadline = now > deadline;
  // Tidak perlu state lokal atletList, gunakan langsung prop atlets

  async function handleDelete(atlet) {
    const confirm = await Swal.fire({
      title: `Hapus data atlet?`,
      text: `Anda yakin ingin menghapus atlet ${atlet.nama_lengkap}? Data dan file akan dihapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    showLoadingSwal({ title: "Menghapus data atlet..." });
    try {
      const response = await fetch("/api/delete-atlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ atlet }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus atlet");
      }
      closeSwal();
      await Swal.fire({
        title: "Berhasil!",
        text: "Data atlet berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      // Trigger fetch ulang data atlet di DashboardPage
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("atlet-deleted"));
      }
    } catch (error) {
      closeSwal();
      console.error("Gagal menghapus atlet:", error);
      await Swal.fire({
        title: "Gagal menghapus!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  }
  // Pagination logic
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const totalPages = Math.ceil(atlets.length / pageSize);
  const paginatedAtlets = atlets.slice((page - 1) * pageSize, page * pageSize);

  // Helper to format kategori_kelas
  function formatKategori(kategori) {
    if (!kategori) return "";
    return kategori
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <section
      className={`bg-${STYLE.white} p-6 sm:p-8 ${STYLE.cardRadius} ${STYLE.cardShadow} border ${STYLE.border} container mx-auto px-6 ${STYLE.container}`}
    >
      {/* Info tenggat pendaftaran */}
      <div className="mb-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <span className="text-sm text-yellow-800 font-semibold">
            Pendaftaran atlet dibuka sampai <b>7 Oktober 2025</b> pukul 23:59
            WIB.
            {isAfterDeadline && (
              <span className="ml-2 text-red-600 font-bold">
                (Sudah lewat tenggat, pendaftaran ditutup)
              </span>
            )}
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Mohon pastikan semua data atlet sudah lengkap dan benar sebelum
            batas waktu pendaftaran.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Daftar Atlet</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total {atlets.length} atlet telah ditambahkan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-sm text-gray-700 font-semibold"
          >
            Tampilkan
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} atlet / halaman
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-start">
          <button
            type="button"
            disabled={isAfterDeadline}
            className={`mt-4 sm:mt-0 flex items-center space-x-2 font-bold py-2 px-5 rounded-lg transition-colors ${
              isAfterDeadline
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : STYLE.buttonPrimary
            }`}
            onClick={() => {
              if (!isAfterDeadline)
                window.location.href = "/dashboard/tambah-atlet";
            }}
          >
            <FaPlus className="w-5 h-5" />
            <span>Tambah Atlet Lain</span>
          </button>
          {/* {isAfterDeadline && (
            <span className="text-xs text-gray-500 mt-2">
              Pendaftaran sudah ditutup.
            </span>
          )} */}
        </div>
      </div>
      <div className="overflow-x-auto max-h-[420px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Nama Atlet
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Kategori Diikuti
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedAtlets.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  Belum ada atlet yang didaftarkan.
                </td>
              </tr>
            ) : (
              paginatedAtlets.map((atlet) => (
                <tr key={atlet.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {atlet.nama_lengkap}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatKategori(atlet.kategori_kelas)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {atlet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link
                      href={`/dashboard/detail-atlet/${atlet.id}`}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      <FiEye className="w-4 h-4" /> Detail
                    </Link>
                    {isAfterDeadline ? (
                      <span className="text-gray-400 inline-flex items-center gap-1 cursor-not-allowed">
                        <FaEdit className="w-4 h-4" />
                        Edit <RiProhibited2Line className="w-4 h-4" />
                      </span>
                    ) : (
                      <Link
                        href={`/dashboard/edit-atlet/${atlet.id}`}
                        className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-1"
                      >
                        <FaEdit className="w-4 h-4" />
                        Edit
                      </Link>
                    )}
                    <button
                      className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                      onClick={() => handleDelete(atlet)}
                    >
                      <FaTrash className="w-4 h-4" />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <span className="px-2 text-sm font-bold">
          Halaman {page} dari {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
        >
          <FaArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-black text-gray-800">
            Siap Menyelesaikan Pendaftaran?
          </h3>
          <p className="text-sm text-gray-600">
            Lakukan pembayaran untuk semua atlet yang terdaftar untuk
            mengamankan slot mereka.
          </p>
        </div>
        <Link
          href="/dashboard/pembayaran"
          className={`mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors`}
        >
          <FaMoneyCheckAlt className="w-5 h-5" />
          <span>Lakukan Pembayaran</span>
        </Link>
      </div>
    </section>
  );
}
