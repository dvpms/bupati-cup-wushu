"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AthletesTable from "@/components/dashboard/AthletesTable";
import PaymentNotice from "@/components/dashboard/PaymentNotice";
import { STYLE } from "@/config/style";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  // Dummy data for prototype
  const [atlets, setAtlets] = useState([
    {
      nama: "Budi Santoso",
      kategori: "Sanda - Junior - 65kg Putra",
      status: "Menunggu Pembayaran",
    },
    {
      nama: "Citra Lestari",
      kategori: "Taolu - Senior - (Tangan Kosong, Senjata Pendek)",
      status: "Menunggu Pembayaran",
    },
  ]);
  const [paymentStatus, setPaymentStatus] = useState("Ditolak"); // "Menunggu Verifikasi", "Ditolak", "Lunas"
  const [paymentNote, setPaymentNote] = useState("Jumlah transfer tidak sesuai dengan tagihan. Harap transfer ulang sejumlah Rp 500.123.");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("session");
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem("session");
    } catch {}
    router.push("/");
  };

  if (!session) {
    return (
      <div className="flex h-screen">
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Tidak ada sesi</h1>
            <p className="mt-2 text-gray-600">Silakan login terlebih dahulu.</p>
            <div className="mt-6">
              <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                Pergi ke Login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const name = session.user?.name || "Kontingen";
  const kontingen = session.user?.kontingen || "Naga Api";
  // Payment status UI
  let paymentCard;
  if (paymentStatus === "Menunggu Verifikasi") {
    paymentCard = (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Menunggu Verifikasi
      </span>
    );
  } else if (paymentStatus === "Ditolak") {
    paymentCard = (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        Ditolak
      </span>
    );
  } else {
    paymentCard = (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
        Lunas
      </span>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100">
      <Sidebar onLogout={logout} />
      <main className={`flex-1 overflow-y-auto`}>
        <div className={`container mx-auto px-6 py-10 ${STYLE.container}`}>
          <header className="mb-10">
            <h1 className="text-4xl md:text-[40px] font-black leading-tight text-gray-800">Selamat Datang, Kontingen {kontingen}!</h1>
            <p className="text-gray-600 mt-1">Kelola pendaftaran atlet Anda di sini.</p>
          </header>
          <SummaryCards atletsCount={atlets.length} totalTagihan="Rp 500.123" paymentCard={paymentCard} />
          <PaymentNotice paymentStatus={paymentStatus} paymentNote={paymentNote} />
          <AthletesTable atlets={atlets} />
        </div>
      </main>
    </div>
  );
}
