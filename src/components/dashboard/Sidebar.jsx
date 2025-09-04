import { STYLE } from "@/config/style";
import Image from "next/image";
import Link from "next/link";
import { FaRegClock, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Sidebar({ onLogout }) {
  const pathname = usePathname();
  return (
    <aside className={`w-64 bg-${STYLE.white} ${STYLE.cardShadow} flex flex-col justify-between border-r ${STYLE.border}`}>
      <div>
        <div className="flex items-center justify-center space-x-2 p-4 border-b border-neutral-200">
          <Image src="/logo-cabang.png" alt="Logo Naga Mas" width={40} height={40} className="w-12 h-12" />
          <span className="font-black text-xl text-gray-800 tracking-tight">Naga Mas</span>
        </div>
        <nav className="mt-6">
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-3 rounded-r-xl font-bold ${
              pathname === "/dashboard"
                ? "bg-purple-50 border-r-4 border-purple-600 text-purple-700"
                : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <FaRegClock className="w-6 h-6 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/profil"
            className={`flex items-center px-4 py-3 rounded-r-xl font-bold ${
              pathname === "/dashboard/profil"
                ? "bg-purple-50 border-r-4 border-purple-600 text-purple-700"
                : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <FaUserCircle className="w-6 h-6 mr-3" />
            Profil Kontingen
          </Link>
        </nav>
      </div>
      <div>
        <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-purple-50 border-t border-neutral-200 font-semibold">
          <FaSignOutAlt className="w-6 h-6 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}