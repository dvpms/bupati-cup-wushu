import { STYLE } from "@/config/style";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentNotice({ paymentStatus, paymentNote }) {
  if (paymentStatus !== "Ditolak") return null;
  return (
    <section className="mb-10 container mx-auto px-6">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl border shadow ring-1 ring-red-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaTimesCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-black text-red-800">Pembayaran Anda Ditolak</h3>
            <p className="text-sm text-red-700 mt-1"><strong>Catatan dari Panitia:</strong> {paymentNote}</p>
            <a href="#" className="mt-2 inline-block text-sm font-bold text-red-800 hover:underline">Unggah Ulang Bukti Pembayaran &rarr;</a>
          </div>
        </div>
      </div>
    </section>
  );
}
