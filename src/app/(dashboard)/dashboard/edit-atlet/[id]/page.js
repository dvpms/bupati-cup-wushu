"use client";
import TambahAtletForm from "@/components/TambahAtletForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FiArrowLeftCircle } from "react-icons/fi";

export default function EditAtletPage({ params }) {
  const router = useRouter();
  const { id: atletId } = React.use(params);

  // TODO: Fetch data atlet by id dari API atau state global
  // Dummy data untuk edit
  const dummyAtlet = {
    nama: `Atlet ${atletId}`,
    kategori: "Sanda Putra Junior",
    status: "Belum Bayar",
    // ...field lain sesuai TambahAtletForm
  };

  function handleSubmitEdit(data) {
    // TODO: Update data atlet ke backend
    // Setelah sukses, redirect ke dashboard
    router.push("/dashboard");
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
          initialData={dummyAtlet}
          onSubmit={handleSubmitEdit}
          isEdit
        />
      </div>
    </div>
  );
}
