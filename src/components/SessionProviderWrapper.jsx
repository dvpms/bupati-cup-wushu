// src/components/SessionProviderWrapper.jsx
// SessionProvider harus di client component karena menggunakan context
"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
