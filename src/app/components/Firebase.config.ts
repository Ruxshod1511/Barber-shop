import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzReuAmpjIDFsrEj9wJQ-ehJr957WAeGY",
  authDomain: "barber-shop-75c00.firebaseapp.com",
  projectId: "barber-shop-75c00",
  storageBucket: "barber-shop-75c00.firebasestorage.app",
  messagingSenderId: "795730061024",
  appId: "1:795730061024:web:fa970942c68376d21a9285",
  measurementId: "G-ECCGN95LYW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
