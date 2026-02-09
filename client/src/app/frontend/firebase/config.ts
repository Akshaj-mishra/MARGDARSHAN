import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0LzoB6_s-wUJZGN9VdGr_KbR3Ync0uZ4",
  authDomain: "markdarshan-01.firebaseapp.com",
  projectId: "markdarshan-01",
  storageBucket: "markdarshan-01.firebasestorage.app",
  messagingSenderId: "750164317158",
  appId: "1:750164317158:web:1a21bd01dcac5e69c57c27",
  measurementId: "G-RPPV1GJ9JH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  return signOut(auth);
};

export default app;