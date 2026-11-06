// ===== Mengetik, tab portfolio, menu aktif, lightbox =====
const teks = ["Desainer Grafis", "Videografer", "Mahasiswa Polimedia"];
let t = 0, c = 0, hapus = false;
const el = document.getElementById("typing");
function ketik() {
  const kata = teks[t];
  el.textContent = kata.slice(0, c);
  if (!hapus && c++ === kata.length) { hapus = true; return setTimeout(ketik, 1200); }
  if (hapus && c-- === 0) { hapus = false; t = (t + 1) % teks.length; }
  setTimeout(ketik, hapus ? 50 : 100);
}
ketik();

document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll(".tab,.panel").forEach((x) => x.classList.remove("on"));
  b.classList.add("on");
  document.getElementById(b.dataset.tab).classList.add("on");
}));

const links = document.querySelectorAll(".pill a");
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { threshold: .45 });
document.querySelectorAll("main section").forEach((s) => io.observe(s));

const lb = document.getElementById("lightbox");
document.addEventListener("click", (e) => {
  const img = e.target.closest(".item-img img");
  if (img) { lb.querySelector("img").src = img.src; lb.classList.add("show"); }
  else if (lb.contains(e.target)) lb.classList.remove("show");
});
