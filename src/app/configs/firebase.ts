import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, getDocs, getDoc, doc, setDoc, writeBatch, DocumentData,
  QuerySnapshot
} from "firebase/firestore";

let analytics;

const firebaseConfig = {
  apiKey: "AIzaSyBoCKxwWLPEPjO3RQ-imwzwyQU8islciz8",
  authDomain: "chatpg-8bfda.firebaseapp.com",
  projectId: "chatpg-8bfda",
  storageBucket: "chatpg-8bfda.firebasestorage.app",
  messagingSenderId: "236293139756",
  appId: "1:236293139756:web:c4e2ebb955444dff78d089",
  measurementId: "G-ZT4WCY8GPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Chỉ khởi tạo Analytics trên client-side
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export {
  db, collection, addDoc, query, orderBy, onSnapshot, getDocs, getDoc, doc, setDoc, writeBatch,
  QuerySnapshot
};
