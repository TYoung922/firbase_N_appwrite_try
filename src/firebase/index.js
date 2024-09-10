// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE4OKlobzEkNEjf-t50breCSdF_j3GACE",
  authDomain: "notes-app-ac03e.firebaseapp.com",
  projectId: "notes-app-ac03e",
  storageBucket: "notes-app-ac03e.appspot.com",
  messagingSenderId: "838470700401",
  appId: "1:838470700401:web:d3435ebd56e1be5e37fad0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
