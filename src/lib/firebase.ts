
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "examplify-8rgrq",
  "appId": "1:1056424535307:web:20ebf76ed80c289a1a6e0e",
  "storageBucket": "examplify-8rgrq.firebasestorage.app",
  "apiKey": "AIzaSyA5pchbjaCkKzHTMVozvScqKCDlIPdq81s",
  "authDomain": "examplify-8rgrq.firebaseapp.com",
  "messagingSenderId": "1056424535307"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
