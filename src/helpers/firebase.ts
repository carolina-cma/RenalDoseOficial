import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCoBQ3Rt0iZjUAq8bL5IK23BbbCTc4lhoU",
  authDomain: "renaldose-e9001.firebaseapp.com",
  projectId: "renaldose-e9001",
  storageBucket: "renaldose-e9001.appspot.com",
  messagingSenderId: "328761658802",
  appId: "1:328761658802:web:3d36cecae003f780c828ab",
  measurementId: "G-QSK1RR9PGQ",
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
