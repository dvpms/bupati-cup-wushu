"use client";
import React from "react";

export default function RincianTagihan({ invoice, subtotal, total, formatRupiah }) {
  return (
    <section className="w-full bg-white p-6 rounded-xl border border-black shadow-md">
      <h2 className="text-2xl font-extrabold text-black mb-6 border-b border-black pb-4">
        Rincian Tagihan
      </h2>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-black font-semibold">ID Tagihan:</span>
          <span className="font-mono text-black font-bold">
            {invoice.id}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black font-semibold">Kontingen:</span>
          <span className="font-bold text-black">
            {invoice.kontingen}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
        <p className="font-bold mb-2 text-black">Item Pembayaran:</p>
        <div className="flex justify-between text-sm">
          <span className="text-black font-semibold">
            Biaya Pendaftaran{" "}
            <span className="text-xs text-black">
              ({invoice.jumlahAtlet} Atlet)
            </span>
          </span>
          <span className="font-bold text-black">
            Rp {formatRupiah(subtotal)}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-black font-semibold">Subtotal</span>
          <span className="font-bold text-black">
            Rp {formatRupiah(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-black font-semibold">
            Kode Unik <span className="text-black">*</span>
          </span>
          <span className="font-bold text-black">
            Rp {formatRupiah(invoice.kodeUnik)}
          </span>
        </div>
        <div className="flex justify-between text-2xl font-extrabold text-white bg-purple-700 p-4 rounded-lg shadow">
          <span>TOTAL PEMBAYARAN</span>
          <span>Rp {formatRupiah(total)}</span>
        </div>
        <p className="text-xs text-black text-right">
          * Harap transfer sesuai nominal total termasuk kode unik untuk
          mempercepat verifikasi.
        </p>
      </div>
    </section>
  );
}
