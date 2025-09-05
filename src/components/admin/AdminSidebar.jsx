"use client";
import Link from "next/link";
import { FaHome, FaCheckCircle, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col justify-between border-r border-neutral-200 min-h-screen">
      <div>
        {/* Logo & Judul Panel */}
        <div className="flex items-center justify-center space-x-2 p-4 border-b border-neutral-200">
          <Image
            src="/logo-cabang.png"
            alt="Logo Naga Mas"
            width={40}
            height={40}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <span className="font-black text-xl text-gray-800 tracking-tight">
              Naga Mas
            </span>
            <p className="text-xs text-purple-600 font-bold">ADMIN PANEL</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="mt-6">
          <SidebarLink
            href="/admin"
            active={pathname === "/admin"}
            icon={<FaHome className="w-6 h-6 mr-3" />}
          >
            Dashboard
          </SidebarLink>
          <SidebarLink
            href="/admin/verifikasi"
            active={pathname === "/admin/verifikasi"}
            icon={<FaCheckCircle className="w-6 h-6 mr-3" />}
          >
            Pembayaran
          </SidebarLink>
          <SidebarLink
            href="/admin/atlet"
            active={pathname === "/admin/atlet"}
            icon={<FaUsers className="w-6 h-6 mr-3" />}
          >
            Data Peserta
          </SidebarLink>
        </nav>
      </div>
      <div>
        <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-purple-50 border-t border-neutral-200 font-semibold">
          <span className="mr-3">
            <FaSignOutAlt className="w-6 h-6" />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ href, active, icon, children }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-r-xl font-bold ${
        active
          ? "bg-purple-50 border-r-4 border-purple-600 text-purple-700"
          : "text-gray-600 hover:bg-purple-50"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
