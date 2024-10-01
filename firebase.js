import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDJSaNPAnzVuSHdBAspSYfBVKg78pJnAo",
  authDomain: "movie-app-c1f5a.firebaseapp.com",
  projectId: "movie-app-c1f5a",
  storageBucket: "movie-app-c1f5a.appspot.com",
  messagingSenderId: "111517240166",
  appId: "1:111517240166:web:8bb5fe440b44875cc216a7",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export { firebaseAuth, googleProvider, storage };
