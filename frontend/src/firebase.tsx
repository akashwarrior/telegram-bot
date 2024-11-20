// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIJK3Ny1P_WOh0yLQkDgd73RRb1qSYr5s",
    authDomain: "color-new-c51fb.firebaseapp.com",
    projectId: "color-new-c51fb",
    storageBucket: "color-new-c51fb.appspot.com",
    messagingSenderId: "876620388621",
    appId: "1:876620388621:web:c33a464bfff1d7411df844",
    measurementId: "G-8C3SHRFRJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };