// ===== Opening: huruf muncul satu-satu, bar loading, lalu tirai terbuka =====
(() => {
  const intro = document.getElementById("intro");
  if (!intro) return;

  const SEKALI_PER_SESI = false; // ubah ke true kalau opening hanya mau tampil sekali per kunjungan
  const lewati = matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (SEKALI_PER_SESI && sessionStorage.getItem("introSudah"));
  if (lewati) { intro.remove(); document.body.classList.remove("intro"); return; }

  // pecah kata menjadi huruf agar bisa dianimasikan satu per satu
  let n = 0;
  intro.querySelectorAll(".kata").forEach((k) => {
    [...k.dataset.t].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "huruf"; s.style.setProperty("--i", n++); s.textContent = ch;
      k.appendChild(s);
    });
  });

  const bar = intro.querySelector(".bar i"), persen = intro.querySelector(".persen");
  const DURASI = 3200;
  const mulai = performance.now();
  let siap = document.readyState === "complete", tutupSudah = false;
  addEventListener("load", () => (siap = true));

  function langkah(now) {
    const p = Math.min((now - mulai) / DURASI, 1);
    const nilai = p >= 1 && !siap ? 99 : Math.round((1 - Math.pow(1 - p, 2.2)) * 100);
    bar.style.transform = `scaleX(${nilai / 100})`;
    persen.textContent = nilai + "%";
    if (p >= 1 && siap) return tutup();
    requestAnimationFrame(langkah);
  }

  function tutup() {
    if (tutupSudah) return;
    tutupSudah = true;
    bar.style.transform = "scaleX(1)"; persen.textContent = "100%";
    setTimeout(() => intro.classList.add("selesai"), 350);           // isi memudar, tirai membuka
    setTimeout(() => {                                                // website mulai beranimasi
      document.body.classList.remove("intro");
      document.dispatchEvent(new Event("introSelesai"));
    }, 900);
    setTimeout(() => intro.remove(), 2200);
    if (SEKALI_PER_SESI) sessionStorage.setItem("introSudah", "1");
  }

  requestAnimationFrame(langkah);
  setTimeout(tutup, 8000); // pengaman
})();