"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }) {
  const logout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar onLogout={logout} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
