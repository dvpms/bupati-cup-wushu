# Konfigurasi Supabase untuk Sistem Pendaftaran Wushu

> **Catatan:** Eksekusi skrip ini di Supabase SQL Editor Anda.  
> Dibuat berdasarkan Skema Database Final.

---

## 1. Pembuatan Tabel

Kita akan membuat tiga tabel utama: `profiles`, `atlet`, dan `pembayaran`.  
Tabel `profiles` terhubung 1-ke-1 dengan tabel `auth.users` milik Supabase.

### Tabel: Profiles (Pengguna)

Menyimpan data tambahan untuk pengguna yang login.

```sql
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    nama_lengkap TEXT NOT NULL,
    nama_kontingen TEXT,
    tipe_user TEXT NOT NULL CHECK (tipe_user IN ('kontingen', 'admin')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);
COMMENT ON TABLE public.profiles IS 'Menyimpan profil untuk semua pengguna, baik kontingen maupun admin.';
```

### Tabel: Atlet

Menyimpan data setiap atlet. Terhubung ke tabel `profiles`.

```sql
CREATE TABLE public.atlet (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap TEXT NOT NULL,
    nik TEXT,
    kk TEXT,
    tempat_lahir TEXT,
    tanggal_lahir DATE,
    kategori_kelas TEXT,
    url_pas_foto TEXT,
    url_foto_kk TEXT,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.atlet IS 'Data individual untuk setiap atlet yang didaftarkan.';
```

### Tabel: Pembayaran

Berfungsi sebagai buku besar untuk melacak semua transaksi.

```sql
CREATE TABLE public.pembayaran (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    jumlah_transfer INT,
    kode_unik INT,
    bukti_url TEXT,
    status TEXT NOT NULL DEFAULT 'Menunggu Verifikasi' CHECK (status IN ('Menunggu Verifikasi', 'LUNAS', 'Ditolak')),
    waktu_konfirmasi TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    catatan_admin TEXT
);
COMMENT ON TABLE public.pembayaran IS 'Melacak semua transaksi pembayaran dari kontingen.';
```

---

## 2. Keamanan (Row Level Security - RLS)

Langkah krusial untuk keamanan data.  
Pastikan pengguna hanya bisa mengakses datanya sendiri.

### Aktifkan RLS

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atlet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pembayaran ENABLE ROW LEVEL SECURITY;
```

### Fungsi Peran Admin

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND tipe_user = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER;
```

### Kebijakan Tabel `profiles`

```sql
CREATE POLICY "Pengguna bisa melihat profilnya sendiri" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin bisa melihat semua profil" ON public.profiles
    FOR SELECT USING (is_admin());

CREATE POLICY "Pengguna bisa memperbarui profilnya sendiri" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
```

### Kebijakan Tabel `atlet`

```sql
CREATE POLICY "Kontingen bisa menambah atlet untuk dirinya sendiri" ON public.atlet
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kontingen bisa melihat dan mengelola atletnya sendiri" ON public.atlet
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin bisa melakukan apa saja pada data atlet" ON public.atlet
    FOR ALL USING (is_admin());
```

### Kebijakan Tabel `pembayaran`

```sql
CREATE POLICY "Kontingen bisa membuat dan melihat pembayarannya sendiri" ON public.pembayaran
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin bisa melakukan apa saja pada data pembayaran" ON public.pembayaran
    FOR ALL USING (is_admin());
```

---

## 3. Penyimpanan File (Storage)

Membuat bucket untuk menyimpan file yang diunggah.

### Bucket Storage

```sql
-- Bucket untuk pas foto atlet
INSERT INTO storage.buckets (id, name, public)
VALUES ('pas_foto_atlet', 'pas_foto_atlet', FALSE);

-- Bucket untuk foto KK
INSERT INTO storage.buckets (id, name, public)
VALUES ('foto_kk', 'foto_kk', FALSE);

-- Bucket untuk bukti pembayaran
INSERT INTO storage.buckets (id, name, public)
VALUES ('bukti_pembayaran', 'bukti_pembayaran', FALSE);
```

### Kebijakan Storage

Pengguna hanya bisa upload dan melihat file miliknya sendiri.

```sql
CREATE POLICY "Kontingen bisa upload pas foto" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'pas_foto_atlet' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Kontingen bisa upload foto KK" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'foto_kk' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Kontingen bisa upload bukti bayar" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'bukti_pembayaran' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Kontingen bisa melihat filenya sendiri" ON storage.objects
    FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admin bisa melihat semua file" ON storage.objects
    FOR SELECT USING (is_admin());
```

---

## Selesai

Konfigurasi Supabase untuk sistem pendaftaran Wushu telah selesai.
