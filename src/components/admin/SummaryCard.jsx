import React from "react";

export default function SummaryCard({ color, value, label, className }) {
  return (
    <div
      className={`w-full min-h-[120px] bg-white rounded-2xl shadow flex flex-col items-center justify-center px-4 py-6 transition hover:scale-[1.03] hover:shadow-xl border border-gray-100 overflow-hidden ${className || ''}`}
    >
      <span
        className={`font-extrabold text-${color} mb-2 text-center truncate w-full`}
        style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
        }}
      >
        {value}
      </span>
      <span
        className="font-semibold text-gray-700 text-center break-words w-full truncate"
        style={{
          fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
