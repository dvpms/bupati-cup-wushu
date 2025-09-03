import Image from "next/image";
import Link from "next/link";
import { EVENT } from "@/config/event";
import { FiMapPin, FiCalendar, FiArrowRight } from "react-icons/fi";

export default function LandingPosterHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient backdrop (purple theme) */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600 via-fuchsia-700 to-indigo-900" />
      <div className="absolute -top-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-fuchsia-300/10 blur-3xl" />

      <div className="relative z-10 container mx-auto px-6 py-16 md:pb-24 md:py-0 lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center mt-3">
          {/* Text content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/20">
              <span className="text-xs font-semibold uppercase tracking-widest">
                Open Tournament Wushu
              </span>
            </div>
            <h1 className="mt-4 text-4xl md:text-[40px] font-black leading-tight">
              {EVENT.name}
            </h1>
            <p className="mt-4 text-white/80 max-w-prose">
              Platform pendaftaran resmi untuk Tournament Naga Mas Bupati Cup.
              <br />
              Bergabunglah dan raih prestasi.
            </p>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 ring-1 ring-white/15">
                <FiCalendar className="w-5 h-5" />
                <span className="text-sm font-medium">{EVENT.dateLabel}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 ring-1 ring-white/15">
                <FiMapPin className="w-5 h-5" />
                <span className="text-sm font-medium">{EVENT.location}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 font-bold py-3 px-6 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Daftar Sekarang
                <FiArrowRight className="w-5 h-5" />
              </Link>
              {/* <Link href={EVENT.links.proposal} className="inline-flex items-center justify-center gap-2 text-white font-bold py-3 px-6 rounded-lg ring-1 ring-white/30 hover:bg-white/10 transition-colors">
                Unduh Proposal
                <FiArrowRight className="w-5 h-5" />
              </Link> */}
            </div>

            {/* Mini supporters strip (moved here) */}
            <div className="mt-8 flex items-center gap-6 opacity-90">
              <span className="text-white/70 text-sm">Didukung Oleh</span>
              <div className="flex items-center gap-6">
                <Image
                  src={EVENT.assets.logos.kabupaten}
                  alt="Kabupaten"
                  width={80}
                  height={80}
                  className="h-20 w-auto brightness-110"
                />
                <Image
                  src={EVENT.assets.logos.pusat}
                  alt="Wushu Indonesia"
                  width={80}
                  height={80}
                  className="h-20 w-auto brightness-110"
                />
              </div>
            </div>
          </div>

          {/* Poster card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[420px]">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-white/40 to-white/10 opacity-0 group-hover:opacity-100 blur transition-opacity" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-white">
                <Image
                  src={EVENT.assets.poster}
                  alt="Poster"
                  width={520}
                  height={740}
                  className="w-full h-auto max-h-[85vh]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
