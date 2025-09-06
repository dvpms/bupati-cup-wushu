"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const logout = async () => {
    const { supabase } = await import("@/utils/supabaseClient");
    await supabase.auth.signOut();
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
