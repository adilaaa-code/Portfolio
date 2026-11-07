// ===== Ambil gambar & video dari Firestore. blok 1-4 = karya, 5 = sertifikat =====
import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function buatGambar(d) {
  const box = document.createElement("div");
  box.className = "item-img";
  const img = document.createElement("img");
  img.src = d.url; img.alt = d.judul || "Karya"; img.loading = "lazy";
  box.appendChild(img);
  return box;
}

function buatVideo(d) {
  const box = document.createElement("div");
  box.className = "item-video";
  if (d.tipe === "youtube") {
    const f = document.createElement("iframe");
    f.src = "https://www.youtube.com/embed/" + d.url;
    f.title = d.judul || "Video karya"; f.loading = "lazy"; f.allowFullscreen = true;
    box.appendChild(f);
  } else {
    const v = document.createElement("video");
    v.src = d.url; v.controls = true; v.preload = "metadata"; v.playsInline = true;
    box.appendChild(v);
  }
  return box;
}

async function muatBlok(nomor) {
  const grid = document.getElementById("grid-" + nomor);
  try {
    const snap = await getDocs(query(collection(db, "karya"), where("blok", "==", nomor)));
    if (snap.empty) { grid.innerHTML = '<p class="kosong">Belum ada karya di sini.</p>'; return; }
    grid.innerHTML = "";
    const items = [];
    snap.forEach((doc) => items.push(doc.data()));
    const video = (d) => (d.tipe === "youtube" || d.tipe === "mp4" ? 1 : 0);
    // Video selalu di paling atas, sisanya urut sesuai waktu upload
    items.sort((a, b) => video(b) - video(a) || (a.waktu?.seconds || 0) - (b.waktu?.seconds || 0));
    items.forEach((d) => grid.appendChild(video(d) ? buatVideo(d) : buatGambar(d)));
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="kosong">Gagal memuat. Cek konfigurasi Firebase.</p>';
  }
}
[1, 2, 3, 4, 5].forEach(muatBlok);