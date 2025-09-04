"use client";
import { FaUserCircle } from "react-icons/fa";
import React from "react";
export default function ProfilKontingenPage() {
  // Dummy data, replace with real kontingen data from session or API
  const [kontingen, setKontingen] = React.useState({
    nama: "Naga Mas",
    kota: "Tangerang",
    provinsi: "Banten",
    manager: "Budi Santoso",
    whatsapp: "081234567890",
    email: "naga.mas@email.com",
  });
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState(kontingen);

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
  function handleSave(e) {
    e.preventDefault();
    setKontingen(form);
    setEditMode(false);
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
