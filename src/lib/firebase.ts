import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Inlined config to avoid any import/resolution issues
const firebaseConfig = {
  projectId: "ai-studio-applet-webapp-77898",
  appId: "1:1057731571160:web:ebcf417bf354d3353656ad",
  apiKey: "AIzaSyDS3h-GWvZFLuEuMpwbD88BelsN4OuEAAY",
  authDomain: "ai-studio-applet-webapp-77898.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-7dc89fc6-90bc-41ca-834b-ae9d0b2c4921",
  storageBucket: "ai-studio-applet-webapp-77898.firebasestorage.app",
  messagingSenderId: "1057731571160",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

// First try with the custom database, but provide a way to fallback or verify
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testConnection() {
  try {
    // Try a public read path
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection successful");
  } catch (error) {
    console.error("Firebase connection test error:", error);
    // If it fails with permissions, maybe the database ID is wrong or rules didn't deploy there
    if (error instanceof Error && error.message.includes('permissions')) {
      console.warn("Possible database ID or rules mismatch. Check if rules were deployed to the correct database instance.");
    }
  }
}
testConnection();

export const isFirebaseConfigured = true;
