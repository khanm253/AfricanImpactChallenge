import React, { useContext, createContext } from "react";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyCtx7BlaJUKKeqo2F1_IkKRQRd2L4Jvz3c",
  authDomain: "c01-project-8d228.firebaseapp.com",
  projectId: "c01-project-8d228",
  storageBucket: "c01-project-8d228.appspot.com",
  messagingSenderId: "897445501911",
  appId: "1:897445501911:web:fcbc95af27d8096dea0992",
  measurementId: "G-3882SN0LDK"
})

const firebaseContext = createContext();

function FirebaseProvider({ children }) {
  return (
    <firebaseContext.Provider value={firebase}>
      {children}
    </firebaseContext.Provider>
  );
}

function useFirebase() {
  return useContext(firebaseContext);
}

export {
  FirebaseProvider,
  useFirebase
}