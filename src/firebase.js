import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLqhL1rthcfpuY9Q54jdOC_EYRTH0ViRc",
  authDomain: "clean-chat-38c26.firebaseapp.com",
  projectId: "clean-chat-38c26",
  storageBucket: "clean-chat-38c26.appspot.com",
  messagingSenderId: "708275902324",
  appId: "1:708275902324:web:e39861f7ee179fea07fe21",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
