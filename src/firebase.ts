// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGtVEP5RUAQ3m5rHZMlD8dWF0eZrIGKIg",
  authDomain: "wordgame-5ed3a.firebaseapp.com",
  projectId: "wordgame-5ed3a",
  storageBucket: "wordgame-5ed3a.appspot.com",
  messagingSenderId: "498937899228",
  appId: "1:498937899228:web:4aae006586c397e4cb2c19",
  measurementId: "G-L42X25DB0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const auth = getAuth(app);

export default app;