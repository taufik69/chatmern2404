
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyDM1xHFsOFTx5KQqDi_N2d6aYGn4BpbAnY",
  authDomain: "mern2404-cc2b4.firebaseapp.com",
  projectId: "mern2404-cc2b4",
  storageBucket: "mern2404-cc2b4.firebasestorage.app",
  messagingSenderId: "449548071750",
  appId: "1:449548071750:web:47d45643bf1a19cb606b47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("database connected")
export default app