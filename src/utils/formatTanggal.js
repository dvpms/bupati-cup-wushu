// Format tanggal ke dd-mm-yyyy
export function formatTanggal(tgl) {
  if (!tgl) return "";
  const dateObj = new Date(tgl);
  if (isNaN(dateObj)) return tgl;
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
