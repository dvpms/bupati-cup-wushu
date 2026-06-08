"use client";
import TambahAtletForm from "@/components/TambahAtletForm";
import Link from "next/link";
import { FiArrowLeftCircle } from "react-icons/fi";
import { tambahAtlet } from "@/utils/supabaseAtlet";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export default function TambahAtletPage() {
  const { data: session } = useSession();

  const handleSubmit = async (form) => {
    try {
      const userId = session?.user?.id;
      if (!userId) throw new Error("Gagal ambil user session. Silakan login kembali.");

      await tambahAtlet({ ...form, userId });
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data atlet berhasil ditambahkan.",
        confirmButtonColor: "#7c3aed",
      });
      window.location.href = "/dashboard";
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.message || "Gagal tambah atlet.",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

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
        <TambahAtletForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
