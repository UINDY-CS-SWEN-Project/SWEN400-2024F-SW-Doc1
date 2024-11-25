// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP1tQQuLRPkKZjUJhySJ565kwuQUNPe2k",
  authDomain: "swen400-6df62.firebaseapp.com",
  projectId: "swen400-6df62",
  storageBucket: "swen400-6df62.appspot.com",
  messagingSenderId: "501735041223",
  appId: "1:501735041223:web:5b0704309957a7a73476e2",
  measurementId: "G-X74XD86MLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);  
const dbFs = getFirestore(app);   

export { app, analytics, auth, db, dbFs };
