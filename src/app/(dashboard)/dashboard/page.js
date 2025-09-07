"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AthletesTable from "@/components/dashboard/AthletesTable";
import PaymentNotice from "@/components/dashboard/PaymentNotice";
import { STYLE } from "@/config/style";
import { FaRegClock, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { supabase } from "@/utils/supabaseClient";

export default function DashboardPage() {
  // const router = useRouter();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [atlets, setAtlets] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Belum Ada"); // "Menunggu Verifikasi", "Ditolak", "Lunas", "Belum Ada"
  const [paymentNote, setPaymentNote] = useState("");
  const [totalTagihan, setTotalTagihan] = useState("");
  console.log("Atlets:", atlets);

  useEffect(() => {
    const fetchSessionProfileAtletsPembayaran = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          setSession(null);
          return;
        }
        setSession(data.session);
        console.log("Session data:", data.session);
        // Fetch user profile from users table
        const userId = data.session.user.id;
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("nama_lengkap, nama_kontingen, email")
          .eq("id", userId)
          .single();
        if (!profileError && userProfile) {
          setProfile(userProfile);
        }
        // Fetch atlet milik user
        const fetchAtlets = async () => {
          const { data: atletList, error: atletError } = await supabase
            .from("atlet")
            .select(
              "id, nama_lengkap, kategori_kelas, url_pas_foto, url_foto_kk, user_id"
            )
            .eq("user_id", userId);
          if (!atletError && Array.isArray(atletList)) {
            setAtlets(atletList);
          }
        };
        await fetchAtlets();
        // Ambil access_token dari sesi
        const accessToken = data.session?.access_token;
        if (!accessToken) throw new Error("Access token tidak ditemukan.");

        // Fetch summary dari API
        const summaryRes = await fetch("/api/kontingen/summary", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const summary = await summaryRes.json();
        console.log("Hasil perhitungan pembayaran:", summary);
        // Total tagihan hanya jumlahAtlet * 70000
        setTotalTagihan(
          summary.summary?.totalAtlet ? `Rp ${summary.summary.totalAtlet * 70000}` : ""
        );

        // Fetch riwayat pembayaran user
        const { data: pembayaranList, error: pembayaranError } = await supabase
          .from("pembayaran")
          .select("status, jumlah_transfer, waktu_konfirmasi")
          .eq("user_id", userId)
          .order("waktu_konfirmasi", { ascending: false });

        let statusPembayaran = "Belum Ada";
        let paymentNoteText = "Belum ada pembayaran yang dikirim.";
        let totalDibayar = 0;
        if (Array.isArray(pembayaranList) && pembayaranList.length > 0) {
          const pembayaranTerakhir = pembayaranList[0];
          if (pembayaranTerakhir.status === "Menunggu Verifikasi") {
            statusPembayaran = "Menunggu Verifikasi";
            paymentNoteText = "Bukti transfer sudah dikirim, menunggu verifikasi admin.";
          } else if (pembayaranTerakhir.status === "LUNAS") {
            statusPembayaran = "Diterima";
            paymentNoteText = "Pembayaran sudah diverifikasi dan diterima.";
            totalDibayar = pembayaranTerakhir.jumlah_transfer;
          } else if (pembayaranTerakhir.status === "Ditolak") {
            statusPembayaran = "Ditolak";
            paymentNoteText = "Pembayaran ditolak, silakan upload ulang bukti transfer.";
          }
        }
        setPaymentStatus(statusPembayaran);
        setPaymentNote(paymentNoteText);
        // Jika ingin menampilkan totalDibayar, bisa set di state
        // setTotalDibayar(totalDibayar);
        // Listen for atlet-deleted event to refetch data
        if (typeof window !== "undefined") {
          window.addEventListener("atlet-deleted", fetchAtlets);
        }
      } catch (err) {
        setSession(null);
      }
    };
    fetchSessionProfileAtletsPembayaran();
    // Cleanup event listener
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("atlet-deleted", () => {});
      }
    };
  }, []);

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
    session?.user?.user_metadata?.nama_lengkap ||
    "Kontingen";
  const kontingen =
    profile?.nama_kontingen ||
    session?.user?.user_metadata?.nama_kontingen ||
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
            <p className="text-gray-600 mt-1">
              Kelola pendaftaran atlet Anda di sini.
            </p>
          </header>
          <SummaryCards
            atletsCount={atlets.length}
            totalTagihan={totalTagihan}
            paymentCard={paymentCard}
          />
          <PaymentNotice
            paymentStatus={paymentStatus}
            paymentNote={paymentNote}
          />
          <AthletesTable atlets={atlets} />
        </div>
      </main>
    </div>
  );
}
