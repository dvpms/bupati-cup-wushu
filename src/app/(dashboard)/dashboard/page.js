"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AthletesTable from "@/components/dashboard/AthletesTable";
import PaymentNotice from "@/components/dashboard/PaymentNotice";
import { STYLE } from "@/config/style";
import { FaRegClock, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { supabase } from "@/utils/supabaseClient";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [atlets, setAtlets] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Belum Ada");
  const [paymentNote, setPaymentNote] = useState("");
  const [totalTagihan, setTotalTagihan] = useState("");

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const userId = session.user.id;

    const fetchData = async () => {
      try {
        // Fetch user profile dari tabel users
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("nama_lengkap, nama_kontingen, email")
          .eq("id", userId)
          .single();
        if (!profileError && userProfile) {
          setProfile(userProfile);
        }

        // Fetch daftar atlet milik user
        const fetchAtlets = async () => {
          const { data: atletList, error: atletError } = await supabase
            .from("atlet")
            .select("id, nama_lengkap, kategori_kelas, url_pas_foto, url_foto_kk, user_id")
            .eq("user_id", userId);
          if (!atletError && Array.isArray(atletList)) {
            setAtlets(atletList);
          }
        };
        await fetchAtlets();

        // Fetch summary dari API (pakai session NextAuth, bukan bearer token manual)
        const summaryRes = await fetch("/api/kontingen/summary");
        if (summaryRes.ok) {
          const summary = await summaryRes.json();
          setTotalTagihan(
            summary.summary?.totalAtlet
              ? `Rp ${summary.summary.totalAtlet * 70000}`
              : ""
          );
        }

        // Fetch riwayat pembayaran
        const { data: pembayaranList, error: pembayaranError } = await supabase
          .from("pembayaran")
          .select("status, jumlah_transfer, waktu_konfirmasi")
          .eq("user_id", userId)
          .order("waktu_konfirmasi", { ascending: false });

        let statusPembayaran = "Belum Ada";
        let paymentNoteText = "Belum ada pembayaran yang dikirim.";
        if (Array.isArray(pembayaranList) && pembayaranList.length > 0) {
          const pembayaranTerakhir = pembayaranList[0];
          if (pembayaranTerakhir.status === "Menunggu Verifikasi") {
            statusPembayaran = "Menunggu Verifikasi";
            paymentNoteText = "Bukti transfer sudah dikirim, menunggu verifikasi admin.";
          } else if (pembayaranTerakhir.status === "LUNAS") {
            statusPembayaran = "Diterima";
            paymentNoteText = "Pembayaran sudah diverifikasi dan diterima.";
          } else if (pembayaranTerakhir.status === "Ditolak") {
            statusPembayaran = "Ditolak";
            paymentNoteText = "Pembayaran ditolak, silakan upload ulang bukti transfer.";
          }
        }
        setPaymentStatus(statusPembayaran);
        setPaymentNote(paymentNoteText);

        // Listen for atlet-deleted event untuk refetch data
        if (typeof window !== "undefined") {
          window.addEventListener("atlet-deleted", fetchAtlets);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("atlet-deleted", () => {});
      }
    };
  }, [session, status]);

  // Tampilkan loading saat session belum terkonfirmasi
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-purple-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  // Tidak ada session — middleware seharusnya sudah redirect, ini fallback
  if (!session) {
    return (
      <div className="flex h-screen">
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Tidak ada sesi</h1>
            <p className="mt-2 text-gray-600">Silakan login terlebih dahulu.</p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Pergi ke Login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const name =
    profile?.nama_lengkap ||
    session?.user?.name ||
    "Kontingen";
  const kontingen =
    profile?.nama_kontingen ||
    session?.user?.nama_kontingen ||
    "Naga Api";

  // Payment status UI
  let paymentCard;
  if (paymentStatus === "Menunggu Verifikasi") {
    paymentCard = (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
        <FaRegClock className="w-4 h-4" />
        Menunggu Verifikasi
      </span>
    );
  } else if (paymentStatus === "Ditolak") {
    paymentCard = (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
        <FaTimesCircle className="w-4 h-4" />
        Ditolak
      </span>
    );
  } else if (paymentStatus === "Lunas") {
    paymentCard = (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
        <FaCheckCircle className="w-4 h-4" />
        Lunas
      </span>
    );
  } else {
    paymentCard = (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
        Belum Ada
      </span>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100">
      <main className={`flex-1 overflow-y-auto`}>
        <div className={`container mx-auto px-6 py-10 ${STYLE.container}`}>
          <header className="mb-10">
            <h1 className="text-4xl md:text-[40px] font-black leading-tight text-gray-800">
              Selamat Datang, Kontingen {kontingen}!
            </h1>
            <p className="text-gray-600 mt-1">Kelola pendaftaran atlet Anda di sini.</p>
          </header>
          <SummaryCards
            atletsCount={atlets.length}
            totalTagihan={totalTagihan}
            paymentCard={paymentCard}
          />
          <PaymentNotice paymentStatus={paymentStatus} paymentNote={paymentNote} />
          <AthletesTable atlets={atlets} />
        </div>
      </main>
    </div>
  );
}
