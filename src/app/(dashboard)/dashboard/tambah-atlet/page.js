import TambahAtletForm from "@/components/TambahAtletForm";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowLeftCircle } from "react-icons/fi";

export const metadata = {
  title: "Tambah Atlet | Dashboard",
};

export default function TambahAtletPage() {
  "use client";
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
        <TambahAtletForm />
      </div>
    </div>
  );
}
