// ===== Koneksi ke Firebase (project: portfolio-adila) =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyccg_f_Wcnfqc0I4wnurZRyKr-LPXldk",
  authDomain: "portfolio-adila.firebaseapp.com",
  projectId: "portfolio-adila",
  storageBucket: "portfolio-adila.firebasestorage.app",
  messagingSenderId: "326169285786",
  appId: "1:326169285786:web:268051ee784ce348b0bb23"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
