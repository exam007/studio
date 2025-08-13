
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "lunar-tooling-427219-j9r",
  appId: "1:771549428053:web:9662820c4c4780521b8f10",
  storageBucket: "lunar-tooling-427219-j9r.appspot.com",
  apiKey: "AIzaSyDP2yF1Hl_wP0nB5_a83151g3NYqRcS3sE",
  authDomain: "lunar-tooling-427219-j9r.firebaseapp.com",
  messagingSenderId: "771549428053"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
