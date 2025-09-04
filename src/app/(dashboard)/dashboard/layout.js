"use client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  const logout = () => {
    try {
      localStorage.removeItem("session");
    } catch {}
    router.push("/");
  };
  return (
    <div className="flex h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-indigo-100">
      <Sidebar onLogout={logout} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
