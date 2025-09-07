# Breakdown Implementasi Backend Supabase

Berikut urutan dan alur implementasi backend Supabase untuk sistem pendaftaran Wushu:

## 1. Autentikasi & Login
- Implementasi login/register menggunakan Supabase Auth.
- Integrasi session dan data tambahan user (profiles/users).

## 2. Dashboard User
- Fetch data user (profile, kontingen) setelah login.
- Tampilkan data atlet milik user.
- Tampilkan status pembayaran user.

## 3. CRUD Atlet
- Tambah, edit, hapus, dan lihat detail atlet.
- Upload file pas foto dan KK ke Supabase Storage.

## 4. CRUD Pembayaran
- Konfirmasi pembayaran, upload bukti transfer, cek status pembayaran.
- Upload file bukti pembayaran ke Storage.

## 5. Dashboard Admin
- Fetch semua data atlet, pembayaran, dan user (akses admin).
- Verifikasi pembayaran dan kelola data peserta.

## 6. Validasi & Security
- Validasi data di frontend/backend.
- Uji policy RLS dan akses data sesuai peran.

## 7. Testing End-to-End
- Uji semua flow: login, pendaftaran atlet, pembayaran, verifikasi, upload file.

---

**Rekomendasi urutan mulai:**
1. Mulai dari login/register (Supabase Auth).
2. Lanjut ke dashboard user (fetch data user, atlet, pembayaran).
3. Implementasi CRUD atlet dan pembayaran.
4. Integrasi dashboard admin dan validasi.

File ini akan diupdate sesuai progres development.
