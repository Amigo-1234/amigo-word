// 🔥 FIREBASE MODULAR SETUP
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDYpP_Uk52egku25vZ4l4iRfkswlc6U4T0",
  authDomain: "amigo-ai-bc5ac.firebaseapp.com",
  projectId: "amigo-ai-bc5ac",
  storageBucket: "amigo-ai-bc5ac.appspot.com",
  messagingSenderId: "280877895436",
  appId: "1:280877895436:web:bef1e5f9f067d1cab34329"
};

// INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// GLOBAL STATE
export let words = [];

// 🔴 LISTEN (REAL-TIME)
export function listenToWords(callback) {
  onSnapshot(collection(db, "words"), (snapshot) => {
    words = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(words);
  });
}

// 🔴 ADD WORD
export async function addWord(data) {
  await addDoc(collection(db, "words"), {
    ...data,
    createdAt: Date.now()
  });
}