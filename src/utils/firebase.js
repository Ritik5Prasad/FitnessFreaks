import * as firebase from "firebase";
import Firebase from "@react-native-firebase/app";

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDq7ENzU_cQ1sNS7iVcJ8kSn54aMVeD--U",
  authDomain: "fitnessapp-203d2.firebaseapp.com",
  projectId: "fitnessapp-203d2",
  storageBucket: "fitnessapp-203d2.appspot.com",
  messagingSenderId: "28227975311",
  appId: "1:28227975311:android:2a34dcc1d76f638dec18fa",
  measurementId: "G-TBBH2XW0Z4"
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();
const auth = firebase.auth();
const firestore = firebase.firestore;

export { db, auth, firestore };