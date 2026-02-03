import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO3_ey3nkqHQ9zjndXj9WXgirl99qM7sg",
  authDomain: "markdarshan-69.firebaseapp.com",
  projectId: "markdarshan-69",
  storageBucket: "markdarshan-69.firebasestorage.app",
  messagingSenderId: "672985278374",
  appId: "1:672985278374:web:c7a33e8d83c316f2379167",
  measurementId: "G-HYMKEMS01M"
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