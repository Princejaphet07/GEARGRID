import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzhQvkbOnxkbcVlyJPSm7ZxOtXq3JJJIE",
  authDomain: "geargrid-c3f90.firebaseapp.com",
  projectId: "geargrid-c3f90",
  storageBucket: "geargrid-c3f90.firebasestorage.app",
  messagingSenderId: "212363085530",
  appId: "1:212363085530:web:e118ff96673e7bd2c2c7e3"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);