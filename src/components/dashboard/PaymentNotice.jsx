import { STYLE } from "@/config/style";

export default function PaymentNotice({ paymentStatus, paymentNote }) {
  if (paymentStatus !== "Ditolak") return null;
  return (
    <section className="mb-10 container mx-auto px-6">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl border shadow ring-1 ring-red-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
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
