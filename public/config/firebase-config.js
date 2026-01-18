// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General -> Your apps -> SDK setup/configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVdNoi0qyYjmevq9WSijiPABOUJSRHQM4",
  authDomain: "mn-millionaires-lottery-club.firebaseapp.com",
  projectId: "mn-millionaires-lottery-club",
  storageBucket: "mn-millionaires-lottery-club.firebasestorage.app",
  messagingSenderId: "1070633282206",
  appId: "1:1070633282206:web:5aa93de4cb366623d0a98f",
  measurementId: "G-WKR90FHX8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, getDoc };