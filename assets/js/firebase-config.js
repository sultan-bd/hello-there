// Firebase Configuration and Initialization - Professional Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZpobBNVi_YG6-hMk4mFx6QiiEGGTLhsw",
  authDomain: "rakan-e3b55.firebaseapp.com",
  projectId: "rakan-e3b55",
  storageBucket: "rakan-e3b55.firebasestorage.app",
  messagingSenderId: "1053112769843",
  appId: "1:1053112769843:web:3017795e7ae7eab6a73246"
};

// Initialize Firebase with error handling
try {
  console.log("Initializing Firebase...");

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Export Firebase services to global scope
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.signInWithEmailAndPassword = signInWithEmailAndPassword;
  window.sendPasswordResetEmail = sendPasswordResetEmail;
  window.onAuthStateChanged = onAuthStateChanged;
  window.signOut = signOut;
  window.fetchSignInMethodsForEmail = fetchSignInMethodsForEmail;
  window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;

  console.log("Firebase initialized successfully");

  // Test auth availability
  if (auth) {
    console.log("Firebase Auth ready");
  } else {
    console.error("Firebase Auth failed to initialize");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);

  // Set error state for other scripts to check
  window.firebaseInitError = error;
}

// Function to check if Firebase is ready
window.checkFirebaseReady = function () {
  return !!(
    window.firebaseAuth &&
    window.sendPasswordResetEmail &&
    window.signInWithEmailAndPassword
  );
};

// Dispatch custom event when Firebase is ready
if (window.firebaseAuth) {
  window.dispatchEvent(new CustomEvent("firebaseReady"));
}