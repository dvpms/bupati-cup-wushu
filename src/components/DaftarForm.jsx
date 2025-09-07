"use client";

import { useEffect, useState, useMemo } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function DaftarForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    kontingenName: "",
    kontingenCity: "",
    kontingenProvince: "",
    managerName: "",
    managerWhatsapp: "",
    email: "",
    password: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Prefill from localStorage if existing draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem("registrationDraft");
      if (raw) {
        const data = JSON.parse(raw);
        setForm((f) => ({ ...f, ...data }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Persist draft locally so refresh doesn't lose data
    try {
      localStorage.setItem("registrationDraft", JSON.stringify(form));
    } catch {}
  }, [form]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onPhoneBlur = () => {
    const digits = form.managerWhatsapp.replace(/\D/g, "");
    if (!digits) return;
    // Normalize simple cases, keep user's intent minimal
    let normalized = digits;
    // If starts with 62 keep, if starts with 0 keep, else just set digits
    if (digits.startsWith("62")) normalized = `+${digits}`;
    setForm((f) => ({ ...f, managerWhatsapp: normalized }));
  };

  const validate = () => {
    const next = {};
    const phoneDigits = form.managerWhatsapp.replace(/\D/g, "");
    const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email);
    if (!form.kontingenName) next.kontingenName = "Wajib diisi";
    if (!form.kontingenCity) next.kontingenCity = "Wajib diisi";
    if (!form.kontingenProvince) next.kontingenProvince = "Wajib diisi";
    if (!form.managerName) next.managerName = "Wajib diisi";
    if (!phoneDigits || phoneDigits.length < 9)
      next.managerWhatsapp = "Nomor tidak valid";
    if (!emailOk) next.email = "Format email tidak valid";
    if (!form.password || form.password.length < 8)
      next.password = "Minimal 8 karakter";
    if (!form.agree) next.agree = "Harus menyetujui syarat & ketentuan";
    setErrors(next);
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    const firstErrorField = Object.keys(errs)[0];
    if (firstErrorField) {
      const el = document.querySelector(`#${fieldId(firstErrorField)}`);
      if (el) el.focus();
      return;
    }
    setLoading(true);
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nama_lengkap: form.managerName,
            nama_kontingen: form.kontingenName,
            tipe_user: "kontingen",
          },
        },
      });
      if (error) {
        setErrors({ email: error.message });
        setLoading(false);
        return;
      }
      // Insert user profile to table after signUp (email verification disabled)
      const user = data.user;
      if (user && user.id) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: user.id,
            email: form.email,
            nama_lengkap: form.managerName,
            nama_kontingen: form.kontingenName,
            tipe_user: 'kontingen',
            created_at: new Date().toISOString(),
          },
        ]);
        if (insertError) {
          // Show RLS error under email field
          setErrors({ email: insertError.message });
          setLoading(false);
          return;
        }
        // Registration success, login user automatically
        setSuccess(true);
        // Login user with email & password
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (loginError) {
          setErrors({ email: loginError.message || "Gagal login otomatis" });
          setLoading(false);
          return;
        }
        setLoading(false);
        router.push("/dashboard");
      } else {
        setErrors({ email: 'Registrasi gagal: user ID tidak ditemukan.' });
        setLoading(false);
      }
    } catch (err) {
      setErrors({ email: err.message || "Gagal mendaftar" });
      setLoading(false);
    }
  };

  const fieldId = (name) => {
    switch (name) {
      case "kontingenName":
        return "kontingen-name";
      case "kontingenCity":
        return "kontingen-city";
      case "kontingenProvince":
        return "kontingen-province";
      case "managerName":
        return "manager-name";
      case "managerWhatsapp":
        return "manager-whatsapp";
      default:
        return name;
    }
  };

  const pwdScore = useMemo(() => {
    const p = form.password || "";
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s; // 0..4
  }, [form.password]);

  const scoreColors = [
    "bg-gray-200",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-600",
  ];
  const scoreLabels = ["Sangat lemah", "Lemah", "Cukup", "Bagus", "Kuat"];

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Header ringkas */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Langkah 1 dari 1</div>
        <button
          type="button"
          onClick={() => {
            setForm({
              kontingenName: "",
              kontingenCity: "",
              kontingenProvince: "",
              managerName: "",
              managerWhatsapp: "",
              email: "",
              password: "",
              agree: false,
            });
            try {
              localStorage.removeItem("registrationDraft");
            } catch {}
          }}
          className="text-sm text-gray-600 hover:text-gray-800 underline underline-offset-4"
        >
          Reset formulir
        </button>
      </div>

      {/* Bagian 1: Informasi Kontingen */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-base font-semibold text-gray-800">
          Informasi Kontingen
        </legend>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="kontingen-name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Kontingen / Sasana <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="kontingen-name"
              name="kontingenName"
              value={form.kontingenName}
              onChange={onChange}
              placeholder="Misal: Naga Mas Tangerang"
              className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              aria-invalid={!!errors.kontingenName}
            />
            <p className="mt-1 text-xs text-gray-500">
              Gunakan nama resmi yang akan tampil di daftar kontingen.
            </p>
            {errors.kontingenName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.kontingenName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="kontingen-city"
              className="block text-sm font-medium text-gray-700"
            >
              Kota <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="kontingen-city"
              name="kontingenCity"
              value={form.kontingenCity}
              onChange={onChange}
              placeholder="Kab/Kota"
              className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              aria-invalid={!!errors.kontingenCity}
            />
            {errors.kontingenCity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.kontingenCity}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="kontingen-province"
              className="block text-sm font-medium text-gray-700"
            >
              Provinsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="kontingen-province"
              name="kontingenProvince"
              value={form.kontingenProvince}
              onChange={onChange}
              placeholder="Provinsi"
              className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              aria-invalid={!!errors.kontingenProvince}
            />
            {errors.kontingenProvince && (
              <p className="mt-1 text-sm text-red-600">
                {errors.kontingenProvince}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Bagian 2: Manajer / Official */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-base font-semibold text-gray-800">
          Manajer / Official
        </legend>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="manager-name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="manager-name"
              name="managerName"
              value={form.managerName}
              onChange={onChange}
              placeholder="Nama sesuai KTP"
              className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              aria-invalid={!!errors.managerName}
            />
            {errors.managerName && (
              <p className="mt-1 text-sm text-red-600">{errors.managerName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="manager-whatsapp"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor WhatsApp (Aktif) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="manager-whatsapp"
              name="managerWhatsapp"
              value={form.managerWhatsapp}
              onChange={onChange}
              onBlur={onPhoneBlur}
              placeholder="Contoh: 081234567890 atau +62812..."
              className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              aria-invalid={!!errors.managerWhatsapp}
            />
            <p className="mt-1 text-xs text-gray-500">
              Pastikan nomor aktif dan terhubung ke WhatsApp.
            </p>
            {errors.managerWhatsapp && (
              <p className="mt-1 text-sm text-red-600">
                {errors.managerWhatsapp}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Bagian 3: Akun */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-base font-semibold text-gray-800">
          Akun
        </legend>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email ini akan digunakan untuk login"
              className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Buat Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 pr-10"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                className="absolute inset-y-0 right-0 top-1/2 -translate-y-1/2 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            {/* Strength meter */}
            <div className="mt-3">
              <div className="flex gap-1" aria-hidden>
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-full rounded ${
                      i < pwdScore ? scoreColors[pwdScore] : "bg-gray-200"
                    }`}
                  ></span>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Kekuatan password: {scoreLabels[pwdScore]}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={form.agree}
            onChange={onChange}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            Saya menyetujui syarat & ketentuan pendaftaran.
          </label>
        </div>
        {errors.agree && (
          <p className="mt-1 text-sm text-red-600">{errors.agree}</p>
        )}
      </fieldset>

      {/* Tombol Aksi */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading && (
              <FaSpinner className="h-5 w-5 animate-spin" />
            )}
          {loading ? "Memproses…" : "Buat Akun"}
        </button>
      </div>
    </form>
  );
}
