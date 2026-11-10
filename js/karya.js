// ===== Gambar & video dari Firestore. blok 1-4 = karya, 5 = sertifikat =====
// Urutan di tiap blok: video -> mockup HP (data-feed + data-akun) -> foto
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

// Pasang gambar; ekstensi dicoba otomatis: .png, .jpg, .jpeg, .webp
function muatGambar(img, nama, gagal) {
  const ada = /\.(png|jpe?g|webp|gif)$/i.test(nama);
  const exts = ada ? [""] : [".png", ".jpg", ".jpeg", ".webp"];
  let i = 0;
  img.onerror = () => { if (++i < exts.length) img.src = nama + exts[i]; else if (gagal) gagal(); };
  img.src = nama + exts[0];
}

// HP dengan layar Instagram yang scroll otomatis ke bawah
function buatHP(feeds, akun) {
  const box = document.createElement("div");
  box.className = "item-hp";
  box.innerHTML = `<div class="hp"><div class="layar"><span class="pulau"></span>
    <div class="status"><b>9:41</b><i>5G ▮</i></div>
    <div class="ig-head"><span>‹</span><b class="akun"></b><span>⋯</span></div>
    <div class="ig-tab"><i class="on">▦</i><i>▷</i><i>⟲</i><i>☺</i></div>
    <div class="area"><div class="feed"></div></div><span class="jari"></span></div></div>`;
  box.querySelector(".akun").textContent = akun;
  const feed = box.querySelector(".feed"), area = box.querySelector(".area");
  const ukur = () => {
    const jarak = Math.max(0, feed.offsetHeight - area.clientHeight);
    box.style.setProperty("--jarak", -jarak + "px");
    box.style.setProperty("--dur", Math.max(12, jarak / 40) + "s");
  };
  let gagal = 0;
  feeds.forEach((f) => {
    const img = new Image();
    img.alt = "Feed Instagram"; img.decoding = "async"; img.onload = ukur;
    muatGambar(img, f, () => { img.remove(); if (++gagal === feeds.length) box.remove(); });
    feed.appendChild(img);
  });
  addEventListener("resize", ukur);
  // berhenti menggulir saat HP tidak terlihat (hemat memori & baterai)
  new IntersectionObserver((es) => es.forEach((e) => box.classList.toggle("jeda", !e.isIntersecting))).observe(box);
  return box;
}

async function muatBlok(nomor) {
  const grid = document.getElementById("grid-" + nomor);
  const feeds = (grid.dataset.feed || "").split(",").map((s) => s.trim()).filter(Boolean);
  const akun = grid.dataset.akun || "";
  try {
    const snap = await getDocs(query(collection(db, "karya"), where("blok", "==", nomor)));
    const items = [];
    snap.forEach((doc) => items.push(doc.data()));
    if (!items.length && !feeds.length) { grid.innerHTML = '<p class="kosong">Belum ada karya di sini.</p>'; return; }

    const adaVideo = (d) => (d.tipe === "youtube" || d.tipe === "mp4" ? 1 : 0);
    items.sort((a, b) => adaVideo(b) - adaVideo(a) || (a.waktu?.seconds || 0) - (b.waktu?.seconds || 0));

    const urut = [];
    items.filter(adaVideo).forEach((d) => urut.push(buatVideo(d)));
    if (feeds.length) {
      const grup = document.createElement("div");
      grup.className = "mockup-grup";
      grup.appendChild(buatHP(feeds, akun));
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