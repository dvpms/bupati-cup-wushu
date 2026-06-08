// src/middleware.js
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Proteksi semua rute dashboard dan admin
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
