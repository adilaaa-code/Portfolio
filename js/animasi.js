// ===== Animasi muncul saat di-scroll =====
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting && !document.body.classList.contains("intro")) { e.target.classList.add("tampil"); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

// dipanggil juga oleh karya.js untuk foto/video yang dimuat dari Firebase
window.munculkan = (el, jeda = 0) => {
  el.classList.add("reveal");
  el.style.setProperty("--d", jeda + "s");
  io.observe(el);
};

const daftar = ".hero-text>*,.photo,.title,.lead,.item,.marquee,.tabs,.blok,.blok>h3,.skills .card,.box,.social";
document.querySelectorAll(daftar).forEach((el) => {
  const urutan = [...el.parentElement.children].indexOf(el);
  window.munculkan(el, Math.min(urutan, 5) * 0.1);
});

// setelah opening selesai, jalankan animasi untuk elemen yang sudah terlihat
document.addEventListener("introSelesai", () => {
  document.querySelectorAll(".reveal:not(.tampil)").forEach((el) => { io.unobserve(el); io.observe(el); });
});