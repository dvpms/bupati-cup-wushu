"use client";

import { useEffect, useState } from "react";
// import Link from "next/link";
import Link from "next/link";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AthletesTable from "@/components/dashboard/AthletesTable";
import PaymentNotice from "@/components/dashboard/PaymentNotice";
import { STYLE } from "@/config/style";
import {
  FaRegClock,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";

export default function DashboardPage() {
  // const router = useRouter();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [atlets, setAtlets] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Belum Ada"); // "Menunggu Verifikasi", "Ditolak", "Lunas", "Belum Ada"
  const [paymentNote, setPaymentNote] = useState("");
  const [totalTagihan, setTotalTagihan] = useState("");

  useEffect(() => {
    const fetchSessionProfileAtletsPembayaran = async () => {
      try {
        const { supabase } = await import("@/utils/supabaseClient");
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          setSession(null);
          return;
        }
        setSession(data.session);
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
        const { data: atletList, error: atletError } = await supabase
          .from("atlet")
          .select("id, nama, kategori, status")
          .eq("user_id", userId);
        if (!atletError && Array.isArray(atletList)) {
          setAtlets(atletList);
        }
        // Fetch pembayaran user
        const { data: pembayaran, error: pembayaranError } = await supabase
          .from("pembayaran")
          .select("status, catatan, total_tagihan")
          .eq("user_id", userId)
          .single();
        if (!pembayaranError && pembayaran) {
          setPaymentStatus(pembayaran.status || "Belum Ada");
          setPaymentNote(pembayaran.catatan || "");
          setTotalTagihan(pembayaran.total_tagihan ? `Rp ${pembayaran.total_tagihan}` : "");
        } else {
          setPaymentStatus("Belum Ada");
          setPaymentNote("");
          setTotalTagihan("");
        }
      } catch (err) {
        setSession(null);
      }
    };
    fetchSessionProfileAtletsPembayaran();
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

  const name = profile?.nama_lengkap || session?.user?.user_metadata?.nama_lengkap || "Kontingen";
  const kontingen = profile?.nama_kontingen || session?.user?.user_metadata?.nama_kontingen || "Naga Api";
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
