-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap text NOT NULL,
  nama_kontingen text,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  tipe_user text NOT NULL CHECK (tipe_user IN ('kontingen', 'admin')),
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel Atlet
CREATE TABLE IF NOT EXISTS atlet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap text NOT NULL,
  nik text NOT NULL,
  kk text NOT NULL,
  tempat_lahir text NOT NULL,
  tanggal_lahir date NOT NULL,
  kategori_kelas text NOT NULL,
  url_pas_foto text,
  url_foto_kk text,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel Pembayaran
CREATE TABLE IF NOT EXISTS pembayaran (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  jumlah_transfer integer NOT NULL,
  kode_unik integer NOT NULL,
  bukti_url text,
  status text NOT NULL CHECK (status IN ('Menunggu Verifikasi', 'LUNAS', 'Ditolak')),
  waktu_konfirmasi timestamp with time zone DEFAULT now(),
  catatan_admin text
);