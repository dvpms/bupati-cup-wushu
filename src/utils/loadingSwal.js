import Swal from "sweetalert2";

export function showLoadingSwal({ title = "Memproses...", text = "Mohon tunggu, proses sedang berlangsung." } = {}) {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export function closeSwal() {
  Swal.close();
}
