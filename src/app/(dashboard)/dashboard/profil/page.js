"use client";
import { FaUserCircle } from "react-icons/fa";
import React from "react";
import { supabase } from "@/utils/supabaseClient";
import Swal from "sweetalert2";
export default function ProfilKontingenPage() {
  const [kontingen, setKontingen] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState({
    nama: "",
    kota: "",
    provinsi: "",
    manager: "",
    whatsapp: "",
    email: "",
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) return;
      const userId = sessionData.session.user.id;
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("nama_kontingen, kota, provinsi, nama_lengkap, whatsapp, email")
        .eq("id", userId)
        .single();
      if (!profileError && userProfile) {
        setKontingen({
          nama: userProfile.nama_kontingen || "",
          kota: userProfile.kota || "",
          provinsi: userProfile.provinsi || "",
          manager: userProfile.nama_lengkap || "",
          whatsapp: userProfile.whatsapp || "",
          email: userProfile.email || "",
        });
        setForm({
          nama: userProfile.nama_kontingen || "",
          kota: userProfile.kota || "",
          provinsi: userProfile.provinsi || "",
          manager: userProfile.manager || "",
          whatsapp: userProfile.whatsapp || "",
          email: userProfile.email || "",
        });
      }
    };
    fetchProfile();
  }, []);

  function handleEdit() {
    setForm(kontingen);
    setEditMode(true);
  }
  function handleCancel() {
    setEditMode(false);
  }
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSave(e) {
    e.preventDefault();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;
    const userId = sessionData.session.user.id;
    // Update ke Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({
        nama_kontingen: form.nama,
        kota: form.kota,
        provinsi: form.provinsi,
        nama_lengkap: form.manager,
        whatsapp: form.whatsapp,
        email: form.email,
      })
      .eq("id", userId);
    if (!updateError) {
      setKontingen(form);
      setEditMode(false);
      Swal.fire({
        icon: "success",
        title: "Profil berhasil diperbarui!",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal update profil kontingen.",
        text: updateError.message || "Terjadi kesalahan.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-purple-200 p-8 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-600 rounded-full p-3 shadow-lg">
          <FaUserCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-purple-700 mb-2 text-center mt-6">
          Profil Kontingen
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Informasi utama kontingen Anda
        </p>
        {!editMode ? (
          kontingen ? (
            <>
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="block text-sm text-gray-500">
                    Nama Kontingen
                  </span>
                  <span className="block text-xl font-bold text-gray-900 tracking-tight">
                    {kontingen.nama}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="block text-sm text-gray-500">Kota</span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {kontingen.kota}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="block text-sm text-gray-500">Provinsi</span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {kontingen.provinsi}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="block text-sm text-gray-500">Manajer</span>
                  <span className="block text-lg font-semibold text-gray-800">
                    {kontingen.manager}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="block text-sm text-gray-500">WhatsApp</span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {kontingen.whatsapp}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="block text-sm text-gray-500">Email</span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {kontingen.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition"
                  onClick={handleEdit}
                >
                  Edit Profil
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">Memuat data kontingen...</div>
          )
        ) : (
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="flex flex-col items-center gap-2">
              <span className="block text-sm text-gray-500">
                Nama Kontingen
              </span>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="block w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-lg font-bold text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="block text-sm text-gray-500">Kota</span>
                <input
                  type="text"
                  name="kota"
                  value={form.kota}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="block text-sm text-gray-500">Provinsi</span>
                <input
                  type="text"
                  name="provinsi"
                  value={form.provinsi}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="block text-sm text-gray-500">Manajer</span>
              <input
                type="text"
                name="manager"
                value={form.manager}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="block text-sm text-gray-500">WhatsApp</span>
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="block text-sm text-gray-500">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>
            <div className="mt-8 flex gap-4 justify-center">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition"
              >
                Simpan
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
                onClick={handleCancel}
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

}
