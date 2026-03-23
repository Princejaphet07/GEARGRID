import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzhQvkbOnxkbcVlyJPSm7ZxOtXq3JJJIE",
  authDomain: "geargrid-c3f90.firebaseapp.com",
  projectId: "geargrid-c3f90",
  storageBucket: "geargrid-c3f90.firebasestorage.app",
  messagingSenderId: "212363085530",
  appId: "1:212363085530:web:e118ff96673e7bd2c2c7e3",
  measurementId: "G-3DFCBNH408"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Gagamitin natin ito para sa Profile Data