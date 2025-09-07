"use client";
import Link from "next/link";
import { FiArrowLeftCircle } from "react-icons/fi";
import React from "react";
import RincianTagihan from "@/components/RincianTagihan";

export default function PembayaranPage() {
  const [file, setFile] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [invoice, setInvoice] = React.useState(null);
  const [riwayatBukti, setRiwayatBukti] = React.useState([]);
  console.log("Riwayat Bukti: ", riwayatBukti);

  // Helper
  const formatRupiah = (num) => num?.toLocaleString("id-ID");

  // Kode unik di-generate setiap render halaman
  const [kodeUnik, setKodeUnik] = React.useState(null);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { supabase } = await import("@/utils/supabaseClient");
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData.session) return;
        const accessToken = sessionData.session.access_token;

        // Fetch invoice summary from backend
        const summaryRes = await fetch("/api/kontingen/summary", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const summary = await summaryRes.json();
        if (summaryRes.ok && summary && summary.profile) {
          // Generate kode unik random 3 digit
          const randomKodeUnik = Math.floor(100 + Math.random() * 200);
          setKodeUnik(randomKodeUnik);
          setInvoice({
            id: `INV/WUSHU/2025/${summary.profile.nama_kontingen}`,
            kontingen: summary.profile.nama_kontingen,
            jumlahAtlet: summary.summary.totalAtlet,
            biayaPerAtlet: 70000,
            kodeUnik: randomKodeUnik,
            bank: {
              nama: "BCA",
              rekening: "888 113 9014",
              atasNama: "MUHAMAD ARYA BINTANG",
            },
          });
        }

        // Fetch riwayat bukti transfer dari Supabase
        const { data: buktiList, error: buktiError } = await supabase
          .from("pembayaran")
          .select(
            "id, url_bukti_pembayaran, waktu_konfirmasi, status, jumlah_transfer, kode_unik, catatan_admin"
          )
          .eq("user_id", sessionData.session.user.id)
          .order("waktu_konfirmasi", { ascending: false });
        if (!buktiError && Array.isArray(buktiList)) {
          setRiwayatBukti(
            buktiList.map((bukti) => ({
              namaFile: bukti.nama_file,
              tanggal: new Date(bukti.waktu_konfirmasi).toLocaleString("id-ID"),
              status: bukti.status,
              url: bukti.url_bukti_pembayaran,
              jumlah_transfer: bukti.jumlah_transfer,
              kode_unik: bukti.kode_unik,
              catatan_admin: bukti.catatan_admin,
            }))
          );
          console.log("Bukti List: ", buktiList);
        }
      } catch (err) {
        // Handle error
      }
    };
    fetchData();
  }, []);

  const subtotal = invoice ? invoice.jumlahAtlet * invoice.biayaPerAtlet : 0;
  const total = invoice && kodeUnik ? subtotal + kodeUnik : 0;

  // Payment card logic: ambil status pembayaran terakhir
  let paymentCardStatus = "Belum Ada";
  if (riwayatBukti.length > 0) {
    const lastStatus = riwayatBukti[0].status;
    if (lastStatus === "Diterima") paymentCardStatus = "Diterima";
    else if (lastStatus === "Menunggu Verifikasi")
      paymentCardStatus = "Menunggu Verifikasi";
    else if (lastStatus === "Ditolak") paymentCardStatus = "Ditolak";
  }

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { supabase } = await import("@/utils/supabaseClient");
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session || !file)
        throw new Error("Session/file missing");
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const filePath = `bukti_pembayaran/${
        sessionData.session.user.id
      }/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("bukti_pembayaran")
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("bukti_pembayaran")
        .getPublicUrl(filePath);
      // Insert pembayaran record sesuai 9 kolom schema
      await supabase.from("pembayaran").insert({
        user_id: sessionData.session.user.id,
        jumlah_transfer: total,
        kode_unik: kodeUnik,
        url_bukti_pembayaran: urlData.publicUrl,
        status: "Menunggu Verifikasi",
        waktu_konfirmasi: new Date().toISOString(),
        catatan_admin: null,
        diverifikasi_oleh: null,
        // id: otomatis oleh Supabase
      });
      setFile(null);
      alert("Konfirmasi pembayaran terkirim. Tim akan verifikasi 1x24 jam.");
      // Refetch riwayat
      const { data: buktiList } = await supabase
        .from("pembayaran")
        .select(
          "id, url_bukti_pembayaran, waktu_konfirmasi, status, jumlah_transfer, kode_unik"
        )
        .eq("user_id", sessionData.session.user.id)
        .order("waktu_konfirmasi", { ascending: false });
      if (Array.isArray(buktiList)) {
        setRiwayatBukti(
          buktiList.map((bukti) => ({
            namaFile: `Bukti Pembayaran ${bukti.id}`,
            waktu_konfirmasi: new Date(bukti.waktu_konfirmasi).toLocaleString(
              "id-ID"
            ),
            status:
              bukti.status === "LUNAS"
                ? "Diterima"
                : bukti.status === "Ditolak"
                ? "Ditolak"
                : "Menunggu Verifikasi",
            url: bukti.url_bukti_pembayaran,
            jumlah_transfer: bukti.jumlah_transfer,
            kode_unik: bukti.kode_unik,
          }))
        );
      } else {
        alert("Gagal mengambil riwayat bukti pembayaran.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Gagal upload bukti transfer. Silakan coba lagi.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-purple-600 font-medium"
          >
            <FiArrowLeftCircle className="mr-2" /> Kembali
          </Link>
        </div>
        <div className="w-full bg-white p-0 sm:p-0 rounded-2xl shadow-xl border border-black mx-auto overflow-hidden">
          <header className="text-center mb-0 bg-purple-700 py-8 px-4 rounded-t-2xl">
            <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">
              Selesaikan Pendaftaran Anda
            </h1>
            <p className="text-gray-100 text-lg">
              Satu langkah terakhir untuk mengamankan slot kontingen Anda.
            </p>
          </header>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 p-8 sm:p-10">
            {/* Kolom kiri: Rincian Tagihan */}
            {invoice ? (
              <RincianTagihan
                invoice={invoice}
                subtotal={subtotal}
                total={total}
                formatRupiah={formatRupiah}
                paymentCardStatus={paymentCardStatus}
              />
            ) : (
              <div className="w-full md:w-1/2 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  Memuat tagihan...
                </div>
              </div>
            )}

            {/* Kolom kanan: Instruksi & Konfirmasi */}
            <section className="w-full md:w-1/2">
              <h2 className="text-2xl font-extrabold text-black mb-6">
                Langkah Pembayaran
              </h2>
              <div className="space-y-8">
                {/* Langkah 1 */}
                <div>
                  <div className="flex items-center mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold mr-4">
                      1
                    </span>
                    <h3 className="text-lg font-semibold text-black">
                      Lakukan Transfer Bank
                    </h3>
                  </div>
                  <div className="pl-12 space-y-3 bg-white p-4 rounded-lg border border-black">
                    <p className="text-sm text-black font-semibold">
                      Bank Tujuan: <br />
                      <span className="font-bold text-black">
                        {invoice?.bank?.nama}
                      </span>
                    </p>
                    <p className="text-sm text-black font-semibold">
                      No. Rekening: <br />
                      <span className="font-bold text-black">
                        {invoice?.bank?.rekening}
                      </span>
                    </p>
                    <p className="text-sm text-black font-semibold">
                      Atas Nama: <br />
                      <span className="font-bold text-black">
                        {invoice?.bank?.atasNama}
                      </span>
                    </p>
                    <p className="text-sm text-black mt-2">
                      Jumlah Transfer: <br />
                      <span className="font-extrabold text-xl text-purple-700">
                        Rp {formatRupiah(total)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div>
                  <div className="flex items-center mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold mr-4">
                      2
                    </span>
                    <h3 className="text-lg font-semibold text-black">
                      Konfirmasi Pembayaran
                    </h3>
                  </div>
                  <div className="pl-12">
                    <form onSubmit={handleSubmit}>
                      <label
                        htmlFor="file-upload-input"
                        className="block text-sm font-bold text-black"
                      >
                        Unggah Bukti Transfer
                      </label>
                      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-black border-dashed rounded-md bg-white">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-black"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                          <div className="flex text-sm text-black">
                            <label
                              htmlFor="file-upload-input"
                              className="relative cursor-pointer bg-black/10 rounded-md font-bold text-black hover:text-black px-2 py-1 border border-black"
                            >
                              <span>Pilih file</span>
                              <input
                                id="file-upload-input"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept=".png,.jpg,.jpeg,.pdf"
                              />
                            </label>
                            <p className="pl-1">atau tarik & lepaskan</p>
                          </div>
                          <p className="text-xs text-black">
                            PNG, JPG, PDF (maks 2MB)
                          </p>
                          {file && (
                            <p className="text-xs text-black">
                              Dipilih:{" "}
                              <span className="font-bold">{file.name}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={!file || submitting}
                        className="mt-6 w-full flex justify-center py-3 px-4 rounded-lg shadow text-lg font-extrabold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                        {submitting ? "Mengirim Konfirmasi…" : "Konfirmasi"}
                      </button>
                      <p className="text-center text-xs text-black mt-3">
                        Tim kami akan memverifikasi pembayaran Anda dalam 1x24
                        jam.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* Riwayat Bukti Transfer */}
          <div className="px-8 sm:px-10 pb-8">
            <h4 className="text-lg font-bold text-black mb-4">
              Riwayat Bukti Transfer
            </h4>
            <div className="space-y-4">
              {riwayatBukti.length === 0 ? (
                <p className="text-sm text-black">
                  Belum ada bukti transfer yang dikirim.
                </p>
              ) : (
                riwayatBukti.map((bukti, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border border-black rounded-lg bg-black/5"
                  >
                    <div>
                      <p className="font-semibold text-black">
                        {bukti.namaFile}
                      </p>
                      <p className="text-xs text-black">{bukti.tanggal}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 rounded text-xs font-bold ${
                          bukti.status === "Diterima"
                            ? "bg-green-100 text-green-700"
                            : bukti.status === "Ditolak"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {bukti.status}
                      </span>
                      {bukti.status === "Ditolak" && bukti.catatan_admin && (
                        <p className="text-xs text-red-700 mt-1 font-semibold">Catatan: {bukti.catatan_admin}</p>
                      )}
                    </div>
                    <a
                      href={bukti.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 font-bold underline text-sm hover:text-purple-900"
                    >
                      Lihat/Unduh
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
