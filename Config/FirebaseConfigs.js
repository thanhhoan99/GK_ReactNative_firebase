// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getStorage }  from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD95rc7-GgdzZtmAp7fCEE19XdY3qFFI1k",
  authDomain: "reacttt-5bfdf.firebaseapp.com",
  projectId: "reacttt-5bfdf",
  storageBucket: "reacttt-5bfdf.appspot.com",
  messagingSenderId: "415954376833",
  appId: "1:415954376833:web:49ca226cd23bef256e1580",
  measurementId: "G-XY8LB92Q26"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage=getStorage(app);
// const analytics = getAnalytics(app);