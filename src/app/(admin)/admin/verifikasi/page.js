"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import Swal from "sweetalert2";

export default function VerifikasiPembayaranPage() {
  const [statusCount, setStatusCount] = useState({
    tertunda: 0,
    lunas: 0,
    ditolak: 0,
  });
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);

  async function fetchData() {
    // Fetch status counts
    const { data: menunggu, error: errMenunggu } = await supabase
      .from("pembayaran")
      .select("id")
      .eq("status", "Menunggu Verifikasi");
    const { data: lunas, error: errLunas } = await supabase
      .from("pembayaran")
      .select("id")
      .eq("status", "LUNAS");
    const { data: ditolak, error: errDitolak } = await supabase
      .from("pembayaran")
      .select("id")
      .eq("status", "Ditolak");

    setStatusCount({
      tertunda: menunggu ? menunggu.length : 0,
      lunas: lunas ? lunas.length : 0,
      ditolak: ditolak ? ditolak.length : 0,
    });

    // Fetch rows for table (join pembayaran + users + atlet count)
    const { data: pembayaranRows, error: errRows } = await supabase
      .from("pembayaran")
      .select(
        `id, user_id, jumlah_transfer, waktu_konfirmasi, url_bukti_pembayaran, status, users!pembayaran_user_id_fkey(nama_kontingen), catatan_admin`
      );
      console.log("Pembayaran Rows:", pembayaranRows, errRows);
    // Fetch jumlah atlet per kontingen
    const { data: atletRows, error: errAtlet } = await supabase
      .from("atlet")
      .select("user_id");

    // Map jumlah atlet per user_id
    const atletCountMap = {};
    if (atletRows) {
      atletRows.forEach((a) => {
        atletCountMap[a.user_id] = (atletCountMap[a.user_id] || 0) + 1;
      });
    }

    // Compose table rows
    const tableRows = (pembayaranRows || []).map((row) => ({
      id: row.id,
      namaKontingen: row.users?.nama_kontingen || "-",
      tagihan: `Rp ${row.jumlah_transfer?.toLocaleString()}`,
      jumlahAtlet: atletCountMap[row.user_id] || 0,
      waktu: row.waktu_konfirmasi
        ? new Date(row.waktu_konfirmasi).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      buktiUrl: row.url_bukti_pembayaran || null,
      status: row.status,
      catatan_admin: row.catatan_admin || null,
    }));
    setRows(tableRows);
  }
  useEffect(() => {
    fetchData();
  }, []);

  // Handler untuk update status pembayaran
  async function handleVerifikasi(id) {
    const { error } = await supabase
      .from("pembayaran")
      .update({ status: "LUNAS" })
      .eq("id", id);
    if (!error) {
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Pembayaran telah diverifikasi." });
      fetchData();
    } else {
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal verifikasi pembayaran." });
    }
  }

  async function handleTolak(id) {
    const { value: catatan, isConfirmed } = await Swal.fire({
      title: "Alasan Penolakan",
      input: "textarea",
      inputLabel: "Masukkan alasan penolakan pembayaran:",
      inputPlaceholder: "Tulis alasan di sini...",
      showCancelButton: true,
      confirmButtonText: "Tolak",
      cancelButtonText: "Batal",
    });
    if (!isConfirmed || !catatan) return;
    const { error } = await supabase
      .from("pembayaran")
      .update({ status: "Ditolak", catatan_admin: catatan })
      .eq("id", id);
    if (!error) {
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Pembayaran telah ditolak." });
      fetchData();
    } else {
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal menolak pembayaran." });
    }
  }

  async function handleEdit(id, currentStatus) {
    const { value: nextStatus, isConfirmed } = await Swal.fire({
      title: "Ubah Status Pembayaran",
      input: "select",
      inputOptions: {
        "Menunggu Verifikasi": "Menunggu Verifikasi",
        LUNAS: "LUNAS",
        Ditolak: "Ditolak",
      },
      inputValue: currentStatus,
      showCancelButton: true,
      confirmButtonText: "Ubah",
      cancelButtonText: "Batal",
    });
    if (!isConfirmed || !nextStatus) return;
    let updateObj = { status: nextStatus };
    if (nextStatus === "Ditolak") {
      const { value: catatan, isConfirmed: isCatatan } = await Swal.fire({
        title: "Alasan Penolakan",
        input: "textarea",
        inputLabel: "Masukkan alasan penolakan pembayaran:",
        inputPlaceholder: "Tulis alasan di sini...",
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
      });
      if (!isCatatan || !catatan) return;
      updateObj.catatan_admin = catatan;
    }
    const { error } = await supabase
      .from("pembayaran")
      .update(updateObj)
      .eq("id", id);
    if (!error) {
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Status pembayaran berhasil diubah." });
      fetchData();
    } else {
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal update status." });
    }
  }

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
            <StatusCard
              color="yellow"
              title="VERIFIKASI TERTUNDA"
              value={statusCount.tertunda}
            />
            <StatusCard
              color="green"
              title="PEMBAYARAN LUNAS"
              value={statusCount.lunas}
            />
            <StatusCard
              color="red"
              title="PEMBAYARAN DITOLAK"
              value={statusCount.ditolak}
            />
          </section>
          {/* Tabel Verifikasi */}
          <section className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 shadow w-5xl">
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Catatan Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {rows.map((row) => (
                    <VerifikasiRow
                      key={row.id}
                      id={row.id}
                      namaKontingen={row.namaKontingen}
                      tagihan={row.tagihan}
                      jumlahAtlet={row.jumlahAtlet}
                      waktu={row.waktu}
                      buktiUrl={row.buktiUrl}
                      status={row.status}
                      catatanAdmin={row.catatan_admin}
                      handleVerifikasi={handleVerifikasi}
                      handleTolak={handleTolak}
                      handleEdit={handleEdit}
                      isEditing={editingId === row.id}
                      setEditingId={setEditingId}
                    />
                  ))}
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

function VerifikasiRow({
  id,
  namaKontingen,
  tagihan,
  waktu,
  jumlahAtlet,
  buktiUrl,
  status,
  catatanAdmin,
  handleVerifikasi,
  handleTolak,
  handleEdit,
  isEditing,
  setEditingId,
}) {
  const isPending = status === "Menunggu Verifikasi";
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
        {buktiUrl ? (
          <a
            href={buktiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 hover:underline font-semibold"
          >
            Lihat Bukti
          </a>
        ) : (
          <span className="text-gray-400">Tidak ada</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === "LUNAS" ? "bg-green-100 text-green-700" : status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{status}</span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {status === "Ditolak" ? (catatanAdmin || <span className="italic text-gray-400">Tidak ada</span>) : <span className="italic text-gray-400">-</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
        {(isPending || isEditing) ? (
          <>
            <button
              className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-bold hover:bg-green-100 transition shadow-sm"
              onClick={() => { handleVerifikasi(id); setEditingId(null); }}
            >
              Setujui
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100 transition shadow-sm"
              onClick={() => { handleTolak(id); setEditingId(null); }}
            >
              Tolak
            </button>
            {!isPending && (
              <button
                className="px-4 py-2 rounded-lg bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition shadow-sm"
                onClick={() => setEditingId(null)}
              >
                Batal
              </button>
            )}
          </>
        ) : (
          <button
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition shadow-sm"
            onClick={() => setEditingId(id)}
          >
            Ubah Status
          </button>
        )}
      </td>
    </tr>
  );
}
