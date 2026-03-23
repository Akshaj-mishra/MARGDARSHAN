import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaU4obm-uDB-goQ1wODsAh5nk2GklkfH0",
  authDomain: "markdarshan-7eb33.firebaseapp.com",
  projectId: "markdarshan-7eb33",
  storageBucket: "markdarshan-7eb33.firebasestorage.app",
  messagingSenderId: "728333223469",
  appId: "1:728333223469:web:4c757e6d7dbdf44c005aa4",
  measurementId: "G-8NDWKT48D2"
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