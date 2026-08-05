import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZUPviYPq9FTK0wv_iApbiSYZSPuAJ7ok",
  authDomain: "snpv-bus-app.firebaseapp.com",
  projectId: "snpv-bus-app",
  storageBucket: "snpv-bus-app.firebasestorage.app",
  messagingSenderId: "229696835076",
  appId: "1:229696835076:web:5471f1bf1367ed502bef51",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
