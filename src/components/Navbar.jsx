import Link from "next/link";
import { EVENT } from "@/config/event";
import { FiAward } from "react-icons/fi";
import Image from "next/image";
// Server component friendly: no client hooks required

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px]">
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="mt-4 flex justify-between items-center px-4 md:px-6 py-3 rounded-2xl border border-neutral-200 bg-white/95 dark:bg-neutral-900/85 shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <Image
              src="/logo-cabang.png"
              alt="Logo"
              width={80}
              height={80}
              className="w-12 h-12 object-contain"
            />
            <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100">
              {EVENT.brand}
            </span>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link
              href="/login"
              className="bg-purple-600 text-white hover:bg-purple-700 font-semibold py-2 px-4 md:px-5 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
