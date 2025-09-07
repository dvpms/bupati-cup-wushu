## Ringkasan Teknis: Alur Perhitungan Real-time

Dokumen ini menguraikan alur kerja teknis untuk menghitung dan menampilkan data finansial (seperti Total Tagihan dan status LUNAS per atlet) secara real-time tanpa menyimpan data turunan di database.

---

### 1. Permintaan Data dari Klien

**Pemicu:**  
Pengguna (Manajer Tim atau Admin) membuka halaman Dashboard atau Data Peserta.

**Aksi:**  
Komponen frontend (React/Next.js) melakukan panggilan API ke backend dengan membawa `user_id` dari pengguna yang sedang login.

**Contoh Endpoint:**  
`GET /api/kontingen-summary?userId=...`

---

### 2. Pemrosesan di Server (Backend Logic)

Server menerima permintaan dan menjalankan serangkaian query ke database Supabase secara sekuensial dan terisolasi:

- **Query A: Hitung Jumlah Atlet**  
    `SELECT count(*) FROM atlet WHERE user_id = [userId]`  
    _Hasil:_ `jumlahAtlet` (misal: 11)

- **Query B: Hitung Total Pembayaran Sah**  
    `SELECT sum(jumlah_transfer) FROM pembayaran WHERE user_id = [userId] AND status = 'LUNAS'`  
    _Hasil:_ `totalPembayaranDiterima` (misal: 2.500.000)

- **Query C (Opsional, Status per Atlet): Ambil Daftar Atlet**  
    `SELECT id, nama_lengkap, created_at FROM atlet WHERE user_id = [userId] ORDER BY created_at ASC`  
    _Hasil:_ `daftarAtlet` (array objek atlet, diurutkan dari yang paling lama)

**Logika Perhitungan di Server:**

- Hitung Tagihan:  
    `totalTagihan = jumlahAtlet * 70.000`
- Hitung Sisa:  
    `sisaTagihan = totalTagihan - totalPembayaranDiterima`
- Hitung Status per Atlet (jika dibutuhkan):  
    - Loop pada `daftarAtlet`
    - Untuk setiap atlet, hitung tagihan kumulatif hingga atlet tersebut
    - Bandingkan dengan `totalPembayaranDiterima` untuk menentukan status "LUNAS" atau "BELUM LUNAS"
    - Hasil: array `atletDenganStatus`

---

### 3. Respons ke Klien

Server menggabungkan semua hasil perhitungan ke dalam satu objek JSON dan mengirimkannya ke frontend:

```json
{
    "totalAtlet": 11,
    "totalTagihan": 770000,
    "totalDibayar": 700000,
    "sisaTagihan": 70000,
    "daftarAtlet": [
        { "id": "uuid-1", "nama": "Budi", "status": "LUNAS" },
        { "id": "uuid-2", "nama": "Citra", "status": "LUNAS" },
        // ... 8 atlet lunas lainnya
        { "id": "uuid-11", "nama": "Eko", "status": "BELUM LUNAS" }
    ]
}
```

Frontend menerima data JSON ini dan menampilkannya di layar. Pengguna melihat informasi yang selalu segar dan akurat, dihitung hanya beberapa milidetik sebelumnya.