# Skema Database Final

Dokumen ini adalah cetak biru teknis final untuk sistem pendaftaran, yang telah disesuaikan dengan semua keputusan arsitektur terbaru.

---

## Tabel 1: Users (Pengguna)

Tabel ini adalah pintu masuk utama untuk semua pengguna, baik manajer kontingen maupun admin. Peran mereka dibedakan oleh kolom `tipe_user`.

| Nama Kolom     | Tipe Data           | Catatan Penting                                         |
| -------------- | ------------------- | ------------------------------------------------------- |
| id             | UUID (Primary Key)  | Identifier unik untuk setiap akun pengguna.              |
| nama_lengkap   | Text                | Nama Manajer Tim atau Nama Admin.                       |
| nama_kontingen | Text (Opsional)     | Diisi hanya jika `tipe_user` adalah 'kontingen'.        |
| email          | Text (Unique)       | Username untuk login.                                   |
| password       | Hashed Text         | Password yang sudah di-hash untuk keamanan.              |
| tipe_user      | Text                | Pilihan: 'kontingen' atau 'admin'. Kunci logika akses.  |
| created_at     | Timestamp           | Waktu pembuatan akun.                                   |

---

## Tabel 2: Atlet

Menyimpan data lengkap untuk setiap atlet individual. Ini adalah data inti dari event.

| Nama Kolom      | Tipe Data           | Catatan Penting                                         |
| --------------- | ------------------- | ------------------------------------------------------- |
| id              | UUID (Primary Key)  | Identifier unik untuk setiap atlet.                     |
| nama_lengkap    | Text                | Nama sesuai dokumen resmi.                              |
| nik             | Text                | Disimpan sebagai teks untuk menjaga angka 0 di depan.   |
| kk              | Text                | Nomor Kartu Keluarga.                                  |
| tempat_lahir    | Text                | Kota/kabupaten kelahiran.                              |
| tanggal_lahir   | Date                | Untuk validasi kelompok usia.                          |
| kategori_kelas  | Text                | Deskripsi kelas yang diikuti (misal: "Sanda Junior 60kg"). |
| url_pas_foto    | Text                | Link ke file pas foto yang diunggah.                   |
| url_foto_kk     | Text                | Link ke file foto KK yang diunggah.                    |
| user_id         | UUID (Foreign Key)  | Kunci Relasi: Terhubung ke Users.id (kontingen).       |
| created_at      | Timestamp           | Sangat Penting: Untuk logika "First In, First Paid".   |

---

## Tabel 3: Pembayaran

Berfungsi sebagai buku besar (ledger) untuk melacak semua transaksi dari setiap kontingen.

| Nama Kolom      | Tipe Data           | Catatan Penting                                         |
| --------------- | ------------------- | ------------------------------------------------------- |
| id              | UUID (Primary Key)  | Identifier unik untuk setiap transaksi.                 |
| user_id         | UUID (Foreign Key)  | Kunci Relasi: Terhubung ke Users.id (kontingen).       |
| jumlah_transfer | Integer             | Jumlah uang yang ditransfer oleh pendaftar.            |
| kode_unik       | Integer             | Kode unik yang ditambahkan ke tagihan.                 |
| bukti_url       | Text                | Link ke file bukti transfer yang diunggah.             |
| status          | Text                | Pilihan: Menunggu Verifikasi, LUNAS, Ditolak.          |
| waktu_konfirmasi| Timestamp           | Waktu saat pendaftar mengunggah bukti.                 |
| catatan_admin   | Text (Opsional)     | Catatan jika pembayaran ditolak (misal: "Jumlah kurang"). |

