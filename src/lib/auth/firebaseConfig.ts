import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDMIJNGw95_YetuVtdAsAe64gCaf5uBaWU",
    authDomain: "taskmanagement-e8c55.firebaseapp.com",
    projectId: "taskmanagement-e8c55",
    storageBucket: "taskmanagement-e8c55.firebasestorage.app",
    messagingSenderId: "306326353242",
    appId: "1:306326353242:web:812d0bb55d82c10091af63",
    measurementId: "G-JZ0KQM938R"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
