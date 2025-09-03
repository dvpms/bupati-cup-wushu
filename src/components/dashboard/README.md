# Dashboard Components

Komponen modular untuk dashboard user Wushu Event.

## Struktur
- Sidebar.jsx: Navigasi dan logout
- SummaryCards.jsx: Kartu ringkasan atlet/tagihan/status
- AthletesTable.jsx: Tabel daftar atlet dan aksi
- PaymentNotice.jsx: Notifikasi penolakan pembayaran

## Cara Pakai
Import dan gunakan di halaman dashboard:

```jsx
import Sidebar from "@/components/dashboard/Sidebar";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AthletesTable from "@/components/dashboard/AthletesTable";
import PaymentNotice from "@/components/dashboard/PaymentNotice";
```

Semua komponen menerima props agar mudah diintegrasikan dengan API/backend.

## Pengembangan Lanjut
- Ganti data dummy dengan data dari API/Supabase
- Tambahkan error/loading boundary
- Pisahkan aksi (edit/hapus atlet) ke komponen/modal terpisah
