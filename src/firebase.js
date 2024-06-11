// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "x-twitterclone.firebaseapp.com",
  projectId: "x-twitterclone",
  storageBucket: "x-twitterclone.appspot.com",
  messagingSenderId: "572822261131",
  appId: "1:572822261131:web:0b53fe6f686eadcf58738e",
  measurementId: "G-WY649SPRLH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);