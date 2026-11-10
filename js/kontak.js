// ===== Kolom komentar (Firestore) =====
import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const daftar = document.getElementById("daftarKomentar");
const status = document.getElementById("status");

async function muatKomentar() {
  try {
    const snap = await getDocs(query(collection(db, "komentar"), orderBy("waktu", "desc"), limit(100)));
    document.getElementById("jumlah").textContent = snap.size;
    daftar.innerHTML = "";
    if (snap.empty) { daftar.innerHTML = '<p class="kosong-kom">Belum ada komentar. Jadi yang pertama!</p>'; return; }
    snap.forEach((d) => {
      const k = d.data();
      const tgl = k.waktu ? k.waktu.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "";
      const row = document.createElement("div"); row.className = "komen";
      const av = document.createElement("div"); av.className = "avatar"; av.textContent = (k.nama || "?").charAt(0).toUpperCase();
      const isi = document.createElement("div"); isi.className = "teks-kom";
      const atas = document.createElement("div"); atas.className = "atas";
      const b = document.createElement("b"); b.textContent = k.nama;
      const s = document.createElement("small"); s.textContent = tgl;
      const p = document.createElement("p"); p.textContent = k.isi;
      atas.append(b, s); isi.append(atas, p); row.append(av, isi); daftar.appendChild(row);
    });
  } catch (err) { console.error(err); daftar.innerHTML = '<p class="kosong-kom">Komentar belum bisa dimuat.</p>'; }
}

document.getElementById("formKomentar").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {   // jeda 30 detik antar komentar supaya tidak di-spam
    if (Date.now() - Number(localStorage.getItem("kmtTerakhir") || 0) < 30000) { status.textContent = "Tunggu sebentar sebelum mengirim komentar lagi."; return; }
  } catch {}
  const nama = kNama.value.trim(), isi = kIsi.value.trim();
  if (!nama || !isi) return;
  try {
    await addDoc(collection(db, "komentar"), { nama, isi, waktu: serverTimestamp() });
    try { localStorage.setItem("kmtTerakhir", Date.now()); } catch {}
    status.textContent = "Komentar terkirim. Terima kasih!";
    e.target.reset(); muatKomentar();
  } catch (err) { console.error(err); status.textContent = "Komentar gagal dikirim. Coba lagi."; }
});
muatKomentar();