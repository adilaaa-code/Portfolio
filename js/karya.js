// ===== Gambar & video dari Firestore. blok 1-4 = karya, 5 = sertifikat =====
// Urutan di tiap blok: video -> mockup HP (data-mockup, boleh banyak, dipisah koma) -> foto
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

// Nama file boleh tanpa ekstensi: otomatis dicoba .png, .jpg, .jpeg, lalu .webp
function buatMockup(nama) {
  const box = document.createElement("div");
  box.className = "item-mockup";
  const img = document.createElement("img");
  const ada = /\.(png|jpe?g|webp|gif)$/i.test(nama);
  const exts = ada ? [""] : [".png", ".jpg", ".jpeg", ".webp"];
  let i = 0;
  img.onerror = () => { if (++i < exts.length) img.src = nama + exts[i]; else box.remove(); };
  img.src = nama + exts[0]; img.alt = "Tampilan karya di Instagram"; img.loading = "lazy";
  box.appendChild(img);
  return box;
}

async function muatBlok(nomor) {
  const grid = document.getElementById("grid-" + nomor);
  const mockups = (grid.dataset.mockup || "").split(",").map((s) => s.trim()).filter(Boolean);
  try {
    const snap = await getDocs(query(collection(db, "karya"), where("blok", "==", nomor)));
    const items = [];
    snap.forEach((doc) => items.push(doc.data()));
    if (!items.length && !mockups.length) { grid.innerHTML = '<p class="kosong">Belum ada karya di sini.</p>'; return; }

    const adaVideo = (d) => (d.tipe === "youtube" || d.tipe === "mp4" ? 1 : 0);
    items.sort((a, b) => adaVideo(b) - adaVideo(a) || (a.waktu?.seconds || 0) - (b.waktu?.seconds || 0));

    const urut = [];
    items.filter(adaVideo).forEach((d) => urut.push(buatVideo(d)));
    if (mockups.length) {
      const grup = document.createElement("div");
      grup.className = "mockup-grup";
      mockups.forEach((m) => grup.appendChild(buatMockup(m)));
      urut.push(grup);
    }
    items.filter((d) => !adaVideo(d)).forEach((d) => urut.push(buatGambar(d)));

    grid.innerHTML = "";
    urut.forEach((el, i) => {
      grid.appendChild(el);
      if (!window.munculkan) return;
      if (el.classList.contains("mockup-grup")) [...el.children].forEach((c, k) => window.munculkan(c, k * 0.1));
      else window.munculkan(el, Math.min(i, 6) * 0.08);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="kosong">Gagal memuat. Cek konfigurasi Firebase.</p>';
  }
}
[1, 2, 3, 4, 5].forEach(muatBlok);