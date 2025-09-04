"use client";
import Link from "next/link";
import { FiArrowLeftCircle } from "react-icons/fi";
import React from "react";

export default function PembayaranPage() {
  const [file, setFile] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  // TODO: Fetch invoice data from backend
  const invoice = {
    id: "INV/WUSHU/2025/123",
    kontingen: "Naga Api",
    jumlahAtlet: 2,
    biayaPerAtlet: 250000,
    kodeUnik: 123,
    bank: {
      nama: "BCA",
      rekening: "1234 5678 9012",
      atasNama: "YAYASAN WUSHU NAGA MAS",
    },
  };
  const subtotal = invoice.jumlahAtlet * invoice.biayaPerAtlet;
  const total = subtotal + invoice.kodeUnik;
  const formatRupiah = (num) => num.toLocaleString('id-ID');

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Upload to backend
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    alert("Konfirmasi pembayaran terkirim. Tim akan verifikasi 1x24 jam.");
  };

  return (
  <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 font-medium">
            <FiArrowLeftCircle className="mr-2" /> Kembali
          </Link>
        </div>
  <div className="w-full bg-white p-0 sm:p-0 rounded-2xl shadow-xl border border-black mx-auto overflow-hidden">
          <header className="text-center mb-0 bg-purple-700 py-8 px-4 rounded-t-2xl">
            <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">Selesaikan Pendaftaran Anda</h1>
            <p className="text-gray-100 text-lg">Satu langkah terakhir untuk mengamankan slot kontingen Anda.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 p-8 sm:p-10">
            {/* Kolom kiri: Rincian Tagihan */}
            <section className="w-full md:w-1/2 bg-white p-6 rounded-xl border border-black shadow-md">
              <h2 className="text-2xl font-extrabold text-black mb-6 border-b border-black pb-4">Rincian Tagihan</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-black font-semibold">ID Tagihan:</span>
                  <span className="font-mono text-black font-bold">{invoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-semibold">Kontingen:</span>
                  <span className="font-bold text-black">{invoice.kontingen}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                <p className="font-bold mb-2 text-black">Item Pembayaran:</p>
                <div className="flex justify-between text-sm">
                  <span className="text-black font-semibold">Biaya Pendaftaran <span className="text-xs text-black">({invoice.jumlahAtlet} Atlet)</span></span>
                  <span className="font-bold text-black">Rp {formatRupiah(subtotal)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black font-semibold">Subtotal</span>
                  <span className="font-bold text-black">Rp {formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black font-semibold">Kode Unik <span className="text-black">*</span></span>
                  <span className="font-bold text-black">Rp {formatRupiah(invoice.kodeUnik)}</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-white bg-purple-700 p-4 rounded-lg shadow">
                  <span>TOTAL PEMBAYARAN</span>
                  <span>Rp {formatRupiah(total)}</span>
                </div>
                <p className="text-xs text-black text-right">* Harap transfer sesuai nominal total termasuk kode unik untuk mempercepat verifikasi.</p>
              </div>
            </section>

            {/* Kolom kanan: Instruksi & Konfirmasi */}
            <section className="w-full md:w-1/2">
              <h2 className="text-2xl font-extrabold text-black mb-6">Langkah Pembayaran</h2>
              <div className="space-y-8">
                {/* Langkah 1 */}
                <div>
                  <div className="flex items-center mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold mr-4">1</span>
                    <h3 className="text-lg font-semibold text-black">Lakukan Transfer Bank</h3>
                  </div>
                  <div className="pl-12 space-y-3 bg-white p-4 rounded-lg border border-black">
                    <p className="text-sm text-black font-semibold">Bank Tujuan: <span className="font-bold text-black">{invoice.bank.nama}</span></p>
                    <p className="text-sm text-black font-semibold">No. Rekening: <span className="font-bold text-black">{invoice.bank.rekening}</span></p>
                    <p className="text-sm text-black font-semibold">Atas Nama: <span className="font-bold text-black">{invoice.bank.atasNama}</span></p>
                    <p className="text-sm text-black mt-2">Jumlah Transfer: <span className="font-extrabold text-xl text-purple-700">Rp {formatRupiah(total)}</span></p>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div>
                  <div className="flex items-center mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold mr-4">2</span>
                    <h3 className="text-lg font-semibold text-black">Konfirmasi Pembayaran</h3>
                  </div>
                  <div className="pl-12">
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="file-upload-input" className="block text-sm font-bold text-black">Unggah Bukti Transfer</label>
                      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-black border-dashed rounded-md bg-white">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-black" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                          <div className="flex text-sm text-black">
                            <label htmlFor="file-upload-input" className="relative cursor-pointer bg-black/10 rounded-md font-bold text-black hover:text-black px-2 py-1 border border-black">
                              <span>Pilih file</span>
                              <input id="file-upload-input" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf" />
                            </label>
                            <p className="pl-1">atau tarik & lepaskan</p>
                          </div>
                          <p className="text-xs text-black">PNG, JPG, PDF (maks 2MB)</p>
                          {file && <p className="text-xs text-black">Dipilih: <span className="font-bold">{file.name}</span></p>}
                        </div>
                      </div>
                      <button type="submit" disabled={!file || submitting} className="mt-6 w-full flex justify-center py-3 px-4 rounded-lg shadow text-lg font-extrabold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300">
                        {submitting ? "Mengirim Konfirmasi…" : "Konfirmasi"}
                      </button>
                      <p className="text-center text-xs text-black mt-3">Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam.</p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
