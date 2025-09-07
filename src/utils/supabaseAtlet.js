import { supabase } from "./supabaseClient";

/**
 * Fungsi untuk menambah atlet baru, termasuk mengunggah file ke Supabase Storage
 * dan menyimpan URL-nya ke database.
 * @param {object} form - Objek berisi data dari form.
 * @param {string} userId - ID pengguna yang sedang login.
 * @returns {Promise<object>} Data atlet yang baru saja dibuat.
 */
export async function tambahAtlet({
  fullName,
  nik,
  kk,
  birthPlace,
  birthDate,
  kategoriKelas,
  pasFoto,
  fotoKK,
  userId,
}) {
  try {
    let pasFotoUrl = null;
    let fotoKKUrl = null;

    // --- BAGIAN 1: PROSES UPLOAD FILE (DENGAN PERBAIKAN) ---

    // Proses Pas Foto jika ada
    if (pasFoto) {
      const pasFotoPath = `${userId}/${Date.now()}_${pasFoto.name}`;
      const { error: uploadError } = await supabase.storage
        .from("pas_foto_atlet")
        .upload(pasFotoPath, pasFoto);
      if (uploadError) {
        throw new Error("Gagal upload pas foto: " + uploadError.message);
      }
      const { data: urlData } = supabase.storage
        .from("pas_foto_atlet")
        .getPublicUrl(pasFotoPath);
      pasFotoUrl = urlData.publicUrl;
    }

    // Proses Foto KK jika ada
    if (fotoKK) {
      const fotoKKPath = `${userId}/${Date.now()}_${fotoKK.name}`;
      const { error: uploadError } = await supabase.storage
        .from("foto_kk")
        .upload(fotoKKPath, fotoKK);
      if (uploadError) {
        throw new Error("Gagal upload foto KK: " + uploadError.message);
      }
      const { data: urlData } = supabase.storage
        .from("foto_kk")
        .getPublicUrl(fotoKKPath);
      fotoKKUrl = urlData.publicUrl;
    }

    // --- BAGIAN 2: SIMPAN SEMUA DATA KE DATABASE ---

    const { data: insertData, error: dbError } = await supabase
      .from("atlet")
      .insert([
        {
          nama_lengkap: fullName,
          nik,
          kk,
          tempat_lahir: birthPlace,
          tanggal_lahir: birthDate,
          kategori_kelas: kategoriKelas,
          url_pas_foto: pasFotoUrl, // Variabel ini sekarang akan berisi URL yang benar
          url_foto_kk: fotoKKUrl, // Variabel ini sekarang akan berisi URL yang benar
          user_id: userId
        },
      ])
      .select()
      .single(); // Gunakan .single() jika Anda hanya memasukkan satu baris untuk hasil yang lebih bersih

    if (dbError) {
      throw new Error("Gagal simpan data atlet ke database: " + dbError.message);
    }

    return insertData;
  } catch (error) {
    throw error;
  }
}
