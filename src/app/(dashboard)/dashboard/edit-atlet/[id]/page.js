"use client";
import TambahAtletForm from "@/components/TambahAtletForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FiArrowLeftCircle } from "react-icons/fi";


export default function EditAtletPage({ params }) {
  const router = useRouter();
  const { id: atletId } = React.use(params);
  const [initialData, setInitialData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  React.useEffect(() => {
    async function fetchAtlet() {
      setLoading(true);
      const { data, error } = await supabase
        .from("atlet")
        .select("id, nama_lengkap, nik, kk, tempat_lahir, tanggal_lahir, kategori_kelas, url_pas_foto, url_foto_kk")
        .eq("id", atletId)
        .single();
      if (error || !data) {
        setInitialData(null);
      } else {
        setInitialData({
          fullName: data.nama_lengkap,
          nik: data.nik,
          kk: data.kk,
          birthPlace: data.tempat_lahir,
          birthDate: data.tanggal_lahir,
          kategoriKelas: data.kategori_kelas,
          pasFoto: data.url_pas_foto,
          fotoKK: data.url_foto_kk,
        });
      }
      setLoading(false);
    }
    fetchAtlet();
  }, [atletId]);

  async function handleSubmitEdit(data) {
    const { error } = await supabase
      .from("atlet")
      .update({
        nama_lengkap: data.fullName,
        nik: data.nik,
        kk: data.kk,
        tempat_lahir: data.birthPlace,
        tanggal_lahir: data.birthDate,
        kategori_kelas: data.kategoriKelas,
        url_pas_foto: data.pasFoto,
        url_foto_kk: data.fotoKK,
      })
      .eq("id", atletId);
    if (!error) {
      await Swal.fire({
        title: "Berhasil!",
        text: "Data atlet berhasil diupdate.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      router.push("/dashboard");
    } else {
      await Swal.fire({
        title: "Gagal update!",
        text: error.message || "Terjadi kesalahan saat update data.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">Memuat data atlet...</span>
      </div>
    );
  }
  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-red-500">Data atlet tidak ditemukan.</span>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-purple-700 font-medium"
          >
            <FiArrowLeftCircle className="mr-2" /> Kembali
          </Link>
        </div>
        <TambahAtletForm
          initialData={initialData}
          onSubmit={handleSubmitEdit}
          isEdit
        />
      </div>
    </div>
  );
}
