// ===== Ambil gambar dari Firestore. blok 1-4 = karya, 5 = sertifikat =====
import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function muatBlok(nomor) {
  const grid = document.getElementById("grid-" + nomor);
  try {
    const snap = await getDocs(query(collection(db, "karya"), where("blok", "==", nomor)));
    if (snap.empty) { grid.innerHTML = '<p class="kosong">Belum ada gambar di sini.</p>'; return; }
    grid.innerHTML = "";
    snap.forEach((d) => {
      const { url, judul } = d.data();
      const box = document.createElement("div");
      box.className = "item-img";
      const img = document.createElement("img");
      img.src = url; img.alt = judul || "Karya"; img.loading = "lazy";
      box.appendChild(img); grid.appendChild(box);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="kosong">Gagal memuat. Cek konfigurasi Firebase.</p>';
  }
}
[1, 2, 3, 4, 5].forEach(muatBlok);
