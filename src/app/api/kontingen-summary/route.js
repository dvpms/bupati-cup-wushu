import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId diperlukan' }, { status: 400 });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Query A: Hitung jumlah atlet
  const { data: atletCountData, error: atletCountError } = await supabase
    .from('atlet')
    .select('id')
    .eq('user_id', userId);
  const jumlahAtlet = atletCountData ? atletCountData.length : 0;

  // Query B: Hitung total pembayaran sah
  const { data: pembayaranData, error: pembayaranError } = await supabase
    .from('pembayaran')
    .select('jumlah_transfer')
    .eq('user_id', userId)
    .eq('status', 'LUNAS');
  const totalPembayaranDiterima = pembayaranData
    ? pembayaranData.reduce((sum, p) => sum + (p.jumlah_transfer || 0), 0)
    : 0;

  // Query C: Ambil daftar atlet
  const { data: daftarAtletData, error: daftarAtletError } = await supabase
    .from('atlet')
    .select('id, nama_lengkap, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  // Perhitungan
  const totalTagihan = jumlahAtlet * 70000;
  const sisaTagihan = totalTagihan - totalPembayaranDiterima;

  // Status per atlet
  let runningTagihan = 0;
  let atletDenganStatus = [];
  if (Array.isArray(daftarAtletData)) {
    for (const atlet of daftarAtletData) {
      runningTagihan += 70000;
      const status = totalPembayaranDiterima >= runningTagihan ? 'LUNAS' : 'BELUM LUNAS';
      atletDenganStatus.push({
        id: atlet.id,
        nama: atlet.nama_lengkap,
        status,
      });
    }
  }

  return NextResponse.json({
    totalAtlet: jumlahAtlet,
    totalTagihan,
    totalDibayar: totalPembayaranDiterima,
    sisaTagihan,
    daftarAtlet: atletDenganStatus,
  });
}
