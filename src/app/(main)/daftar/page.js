import { EVENT } from "@/config/event";
import DaftarForm from "@/components/DaftarForm";

export const metadata = {
  title: `Daftar | ${EVENT.brand}`,
};

export default function DaftarPage() {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto py-12 md:py-16 px-6 md:px-8 lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px]">
        {/* Satu kolom: Formulir penuh, dipusatkan */}
        <section className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Pendaftaran Kontingen</h1>
          <p className="text-gray-600 mt-2">Lengkapi data di bawah ini untuk memulai.</p>

          <DaftarForm />
        </section>
      </div>
    </div>
  );
}
