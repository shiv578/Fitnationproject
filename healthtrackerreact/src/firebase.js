import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAVx8IEGn25XWAG_Q6AW7e3n12aepgLQ",
  authDomain: "fitnation-5bf70.firebaseapp.com",
  projectId: "fitnation-5bf70",
  storageBucket: "fitnation-5bf70.appspot.com",
  messagingSenderId: "208973525620",
  appId: "1:208973525620:web:894a154edfab349d649721",
  measurementId: "G-4J4KFS7RYZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
