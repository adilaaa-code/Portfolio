// ===== Titik-titik biru melayang di background =====
const cv = document.getElementById("stars"), cx = cv.getContext("2d");
let pts = [];
function atur() {
  cv.width = innerWidth; cv.height = innerHeight;
  pts = Array.from({ length: 70 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height,
    r: Math.random() * 2 + .8, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
}
function gambar() {
  cx.clearRect(0, 0, cv.width, cv.height);
  cx.fillStyle = "rgba(30,107,255,.45)";
  for (const p of pts) {
    p.x = (p.x + p.vx + cv.width) % cv.width; p.y = (p.y + p.vy + cv.height) % cv.height;
    cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill();
  }
  requestAnimationFrame(gambar);
}
addEventListener("resize", atur); atur(); gambar();
