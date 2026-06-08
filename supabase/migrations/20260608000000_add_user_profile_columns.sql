-- Migration: Tambah kolom kota, provinsi, whatsapp ke tabel users
-- Jalankan SQL ini di Supabase SQL Editor jika kolom belum ada

ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS kota text,
  ADD COLUMN IF NOT EXISTS provinsi text,
  ADD COLUMN IF NOT EXISTS whatsapp text;
