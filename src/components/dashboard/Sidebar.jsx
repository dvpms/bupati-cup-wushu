import { STYLE } from "@/config/style";

export default function Sidebar({ onLogout }) {
  return (
    <aside className={`w-64 bg-${STYLE.white} ${STYLE.cardShadow} flex flex-col justify-between border-r ${STYLE.border}`}>
      <div>
        <div className="flex items-center justify-center space-x-2 p-4 border-b border-neutral-200">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span className="font-black text-xl text-gray-800 tracking-tight">WUSHU EVENT</span>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-4 py-3 bg-purple-50 border-r-4 border-purple-600 text-purple-700 font-bold rounded-r-xl">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-purple-50 rounded-r-xl">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Profil Kontingen
          </a>
        </nav>
      </div>
      <div>
        <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-purple-50 border-t border-neutral-200 font-semibold">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
