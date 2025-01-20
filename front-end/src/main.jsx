import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb6Hqh2PbXXyYEnPtknlie_8Jo-uzD5fw",
  authDomain: "practice-full-stack-react.firebaseapp.com",
  projectId: "practice-full-stack-react",
  storageBucket: "practice-full-stack-react.firebasestorage.app",
  messagingSenderId: "775371816009",
  appId: "1:775371816009:web:35e34d9032604644839398",
  measurementId: "G-V2TZTZ45WD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
