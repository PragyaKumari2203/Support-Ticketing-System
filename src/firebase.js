
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDTt7BboTRgTajr9MBY53WQfm5c-mhZFEc",
  authDomain: "support-ticketing-system-e0647.firebaseapp.com",
  projectId: "support-ticketing-system-e0647",
  storageBucket: "support-ticketing-system-e0647.firebasestorage.app",
  messagingSenderId: "417018010496",
  appId: "1:417018010496:web:92e3ce7153f264d181ff65",
  measurementId: "G-3XTX56CV3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export default app;