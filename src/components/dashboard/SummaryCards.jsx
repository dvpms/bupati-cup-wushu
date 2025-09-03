import { STYLE } from "@/config/style";

export default function SummaryCards({ atletsCount, totalTagihan, paymentCard }) {
  return (
    <section className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 container mx-auto px-6 ${STYLE.container}`}>
      <div className={`bg-${STYLE.white} p-6 ${STYLE.cardRadius} ${STYLE.cardShadow} border ${STYLE.border}`}>
        <h3 className="text-sm font-semibold text-gray-500 tracking-wide">ATLET TERDAFTAR</h3>
        <p className="text-3xl font-black text-gray-800 mt-1">{atletsCount}</p>
      </div>
      <div className={`bg-${STYLE.white} p-6 ${STYLE.cardRadius} ${STYLE.cardShadow} border ${STYLE.border}`}>
        <h3 className="text-sm font-semibold text-gray-500 tracking-wide">TOTAL TAGIHAN</h3>
        <p className="text-3xl font-black text-gray-800 mt-1">{totalTagihan}</p>
      </div>
      <div className={`bg-${STYLE.white} p-6 ${STYLE.cardRadius} ${STYLE.cardShadow} border ${STYLE.border}`}>
        <h3 className="text-sm font-semibold text-gray-500 tracking-wide">STATUS PEMBAYARAN</h3>
        <div className="mt-2">{paymentCard}</div>
      </div>
    </section>
  );
}
