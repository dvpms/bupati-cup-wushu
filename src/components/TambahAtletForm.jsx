"use client";

import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { STYLE } from "@/config/style";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { showLoadingSwal, closeSwal } from "@/utils/loadingSwal";


export default function TambahAtletForm({ initialData, onSubmit, isEdit }) {
  const [modalPreview, setModalPreview] = useState({ open: false, src: "", type: "" });
  const router = useRouter();
  const [form, setForm] = useState(initialData || {
    fullName: "",
    nik: "",
    kk: "",
    birthPlace: "",
    birthDate: "",
    kategoriKelas: "",
    pasFoto: null,
    fotoKK: null,
  });
  const [deletingPasFoto, setDeletingPasFoto] = useState(false);
  const [deletingFotoKK, setDeletingFotoKK] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync form state if initialData changes (for edit)
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const validate = () => {
    const next = {};
  if (!form.fullName) next.fullName = "Wajib diisi";
  if (!form.nik || form.nik.length !== 16 || !/^\d+$/.test(form.nik)) next.nik = "NIK harus 16 digit angka";
  if (!form.kk || form.kk.length !== 16 || !/^\d+$/.test(form.kk)) next.kk = "Nomor KK harus 16 digit angka";
  if (!form.birthPlace) next.birthPlace = "Wajib diisi";
  if (!form.birthDate) next.birthDate = "Wajib diisi";
  if (!form.kategoriKelas) next.kategoriKelas = "Wajib diisi";
  if (!form.pasFoto) next.pasFoto = "Wajib upload pas foto";
  if (!form.fotoKK) next.fotoKK = "Wajib upload foto KK";
    setErrors(next);
    return next;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setFileName(files[0]?.name || "");
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return;

    // Konfirmasi ulang data atlet sebelum submit
    const htmlPreview = `
      <ul style='text-align:left'>
        <li><b>Nama Lengkap:</b> ${form.fullName}</li>
        <li><b>NIK:</b> ${form.nik}</li>
        <li><b>Nomor KK:</b> ${form.kk}</li>
        <li><b>Tempat Lahir:</b> ${form.birthPlace}</li>
        <li><b>Tanggal Lahir:</b> ${form.birthDate}</li>
        <li><b>Kategori Kelas:</b> ${form.kategoriKelas}</li>
        <li><b>Pas Foto:</b> ${form.pasFoto?.name || '-'}</li>
        <li><b>Foto KK:</b> ${form.fotoKK?.name || '-'}</li>
      </ul>
    `;
    const result = await Swal.fire({
      title: isEdit ? "Konfirmasi Perubahan Data Atlet" : "Konfirmasi Data Atlet Baru",
      html: htmlPreview,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      focusConfirm: false,
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      showLoadingSwal({
        title: isEdit ? "Menyimpan perubahan..." : "Menyimpan data atlet...",
        text: "Mohon tunggu, proses sedang berlangsung.",
      });
      if (onSubmit) {
        await onSubmit(form);
      } else {
        // Simulate API call
        await new Promise((r) => setTimeout(r, 900));
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
      closeSwal();
    }
  };

  return (
  <div className="w-full max-w-2xl bg-white/90 p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-300 backdrop-blur-sm mx-auto">
      {/* Header Formulir */}
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-900">
          {isEdit ? "Edit Data Atlet" : "Tambah Atlet Baru"}
        </h1>
        <p className="text-center text-gray-700 mt-2">
          {isEdit ? "Perbarui data atlet sesuai dokumen resmi." : "Pastikan data yang dimasukkan sesuai dengan dokumen resmi."}
        </p>
      </div>
      {/* Formulir */}
      <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
        {/* Bagian 1: Data Diri Atlet */}
        <fieldset>
          <legend className="text-lg font-semibold text-purple-700 mb-4">1. Data Diri Atlet</legend>
          <div className="space-y-6">
            <div>
              <label htmlFor="full-name" className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                id="full-name"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="Sesuai Akte/KK"
                className="mt-1 block w-full bg-white border border-gray-400 rounded-lg shadow-sm py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="nik" className="block text-sm font-semibold text-gray-700">Nomor Induk Kependudukan (NIK)</label>
              <input
                type="text"
                id="nik"
                name="nik"
                required
                value={form.nik}
                onChange={handleChange}
                placeholder="16 digit NIK"
                className="mt-1 block w-full bg-white border border-gray-400 rounded-lg shadow-sm py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                aria-invalid={!!errors.nik}
              />
              {errors.nik && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.nik}</p>}
            </div>
            <div>
              <label htmlFor="kk" className="block text-sm font-semibold text-gray-700">Nomor KK</label>
              <input
                type="text"
                id="kk"
                name="kk"
                required
                value={form.kk}
                onChange={handleChange}
                placeholder="16 digit Nomor KK"
                className="mt-1 block w-full bg-white border border-gray-400 rounded-lg shadow-sm py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                aria-invalid={!!errors.kk}
              />
              {errors.kk && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.kk}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="birth-place" className="block text-sm font-semibold text-gray-700">Tempat Lahir</label>
                <input
                  type="text"
                  id="birth-place"
                  name="birthPlace"
                  required
                  value={form.birthPlace}
                  onChange={handleChange}
                  placeholder="Kota/Kabupaten"
                  className="mt-1 block w-full bg-white border border-gray-400 rounded-lg shadow-sm py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  aria-invalid={!!errors.birthPlace}
                />
                {errors.birthPlace && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.birthPlace}</p>}
              </div>
              <div>
                <label htmlFor="birth-date" className="block text-sm font-semibold text-gray-700">Tanggal Lahir</label>
                <input
                  type="date"
                  id="birth-date"
                  name="birthDate"
                  required
                  value={form.birthDate}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-white border border-gray-400 rounded-lg shadow-sm py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  aria-invalid={!!errors.birthDate}
                />
                {errors.birthDate && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.birthDate}</p>}
              </div>
            </div>
          </div>
        </fieldset>
        {/* Bagian 2: Kategori & Kelas (Gabungan) */}
        <fieldset>
          <legend className="text-lg font-semibold text-purple-700 mb-4">2. Kategori & Kelas</legend>
          <div>
            <label htmlFor="kategoriKelas" className="block text-sm font-semibold text-gray-700">Kategori & Kelas</label>
            <select
              id="kategoriKelas"
              name="kategoriKelas"
              required
              value={form.kategoriKelas}
              onChange={handleChange}
              className="mt-1 block w-full bg-white border border-gray-400 rounded-lg shadow-sm py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              aria-invalid={!!errors.kategoriKelas}
            >
              <option value="">-- Pilih Kategori & Kelas --</option>
              <option value="Empty Hand B Putra">Empty Hand B Putra</option>
              <option value="Empty Hand C Putra">Empty Hand C Putra</option>
              <option value="Empty Hand D Putra">Empty Hand D Putra</option>
              <option value="Empty Hand B Putri">Empty Hand B Putri</option>
              <option value="Empty Hand C Putri">Empty Hand C Putri</option>
              <option value="Empty Hand D Putri">Empty Hand D Putri</option>
              <option value="Chanquan B Putra">Chanquan B Putra</option>
              <option value="Chanquan C Putra">Chanquan C Putra</option>
              <option value="Chanquan D Putra">Chanquan D Putra</option>
              <option value="Chanquan B Putri">Chanquan B Putri</option>
              <option value="Chanquan C Putri">Chanquan C Putri</option>
              <option value="Chanquan D Putri">Chanquan D Putri</option>
              <option value="Nanquan B Putra Putri">Nanquan B Putra Putri</option>
              <option value="Nanquan C Putra Putri">Nanquan C Putra Putri</option>
              <option value="Nanquan D Putra Putri">Nanquan D Putra Putri</option>
              <option value="Freestyle Putra Putri">Freestyle Putra Putri</option>
            </select>
            {errors.kategoriKelas && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.kategoriKelas}</p>}
          </div>
        </fieldset>
        {/* Bagian 3: Berkas Pendukung */}
        <fieldset>
          <legend className="text-lg font-semibold text-purple-700 mb-4">3. Berkas Pendukung</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pas-foto" className="block text-sm font-semibold text-gray-700">Upload Pas Foto</label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="pas-foto"
                  name="pasFoto"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  disabled={form.pasFoto && typeof form.pasFoto === "string" && !deletingPasFoto}
                />
              </div>
              {/* Preview & Delete Pas Foto */}
              {form.pasFoto && typeof form.pasFoto === "string" && !deletingPasFoto && (
                <div className="mt-2 flex flex-col gap-2">
                  <img
                    src={form.pasFoto}
                    alt="Preview Pas Foto"
                    className="w-32 h-40 object-cover rounded border cursor-pointer hover:scale-105 transition"
                    onClick={() => setModalPreview({ open: true, src: form.pasFoto, type: "image" })}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600 underline font-semibold w-fit"
                    onClick={async () => {
                      setDeletingPasFoto(true);
                      showLoadingSwal({ title: "Menghapus pas foto..." });
                      setForm((prev) => ({ ...prev, pasFoto: null }));
                      closeSwal();
                      setDeletingPasFoto(false);
                    }}
                  >Hapus Pas Foto</button>
                </div>
              )}
              {errors.pasFoto && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.pasFoto}</p>}
            </div>
            <div>
              <label htmlFor="foto-kk" className="block text-sm font-semibold text-gray-700">Upload Foto KK</label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="foto-kk"
                  name="fotoKK"
                  type="file"
                  accept=".png"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  disabled={form.fotoKK && typeof form.fotoKK === "string" && !deletingFotoKK}
                />
              </div>
              {/* Preview & Delete Foto KK */}
              {form.fotoKK && typeof form.fotoKK === "string" && !deletingFotoKK && (
                <div className="mt-2 flex flex-col gap-2">
                  <img
                    src={form.fotoKK}
                    alt="Preview Foto KK"
                    className="w-32 h-40 object-cover rounded border cursor-pointer hover:scale-105 transition"
                    onClick={() => setModalPreview({ open: true, src: form.fotoKK, type: "image" })}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600 underline font-semibold w-fit"
                    onClick={async () => {
                      setDeletingFotoKK(true);
                      showLoadingSwal({ title: "Menghapus foto KK..." });
                      setForm((prev) => ({ ...prev, fotoKK: null }));
                      closeSwal();
                      setDeletingFotoKK(false);
                    }}
                  >Hapus Foto KK</button>
                </div>
              )}
              {errors.fotoKK && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.fotoKK}</p>}
            </div>
          </div>
        </fieldset>
        {/* Tombol Aksi */}
        <div className="pt-6 border-t border-gray-300">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 text-lg font-bold rounded-lg shadow bg-purple-700 hover:bg-purple-800 text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (isEdit ? "Menyimpan Perubahan…" : "Menyimpan…") : (isEdit ? "Simpan Perubahan" : "Simpan Data Atlet")}
          </button>
        </div>
      </form>
    {/* Modal Preview */}
    {modalPreview.open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModalPreview({ open: false, src: "", type: "" })}>
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
            onClick={() => setModalPreview({ open: false, src: "", type: "" })}
            aria-label="Tutup Preview"
          >×</button>
          {modalPreview.type === "image" && (
            <img src={modalPreview.src} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain rounded" />
          )}
        </div>
      </div>
    )}
  </div>
  );
}
