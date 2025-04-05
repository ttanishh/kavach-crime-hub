
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC-tL1N9w71u66LgK8KKVJqJ4wGzLU_sJM",
  authDomain: "kavach-58841.firebaseapp.com",
  projectId: "kavach-58841",
  storageBucket: "kavach-58841.firebasestorage.app",
  messagingSenderId: "1001180207294",
  appId: "1:1001180207294:web:0ecc444802f1ec35ce66ef",
  measurementId: "G-7X6G2ELH4P"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
