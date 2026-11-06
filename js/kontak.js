// ===== Form pesan + komentar (Firestore) =====
import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("formKontak").addEventListener("submit", async (e) => {
  e.preventDefault();
  const st = document.getElementById("status");
  try {
    await addDoc(collection(db, "pesan"), { nama: nama.value, email: email.value, pesan: pesan.value, waktu: serverTimestamp() });
    st.textContent = "Pesan terkirim. Terima kasih!"; e.target.reset();
  } catch { st.textContent = "Pesan gagal dikirim. Coba lagi."; }
});

const daftar = document.getElementById("daftarKomentar");
async function muatKomentar() {
  try {
    const snap = await getDocs(query(collection(db, "komentar"), orderBy("waktu", "desc")));
    document.getElementById("jumlah").textContent = snap.size;
    daftar.innerHTML = "";
    snap.forEach((d) => {
      const k = d.data();
      const tgl = k.waktu ? k.waktu.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "";
      const row = document.createElement("div"); row.className = "kom";
      const b = document.createElement("b"); b.textContent = k.nama;
      const s = document.createElement("small"); s.textContent = tgl;
      const p = document.createElement("p"); p.textContent = k.isi;
      row.append(b, s, p); daftar.appendChild(row);
    });
  } catch (err) { console.error(err); }
}
document.getElementById("formKomentar").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await addDoc(collection(db, "komentar"), { nama: kNama.value, isi: kIsi.value, waktu: serverTimestamp() });
    e.target.reset(); muatKomentar();
  } catch (err) { console.error(err); }
});
muatKomentar();
