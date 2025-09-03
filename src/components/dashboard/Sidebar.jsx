import { STYLE } from "@/config/style";
import { FaRegClock, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({ onLogout }) {
  return (
    <aside className={`w-64 bg-${STYLE.white} ${STYLE.cardShadow} flex flex-col justify-between border-r ${STYLE.border}`}>
      <div>
        <div className="flex items-center justify-center space-x-2 p-4 border-b border-neutral-200">
          <FaRegClock className="w-8 h-8 text-purple-600" />
          <span className="font-black text-xl text-gray-800 tracking-tight">WUSHU EVENT</span>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-4 py-3 bg-purple-50 border-r-4 border-purple-600 text-purple-700 font-bold rounded-r-xl">
            <FaRegClock className="w-6 h-6 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-purple-50 rounded-r-xl">
            <FaUserCircle className="w-6 h-6 mr-3" />
            Profil Kontingen
          </a>
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
