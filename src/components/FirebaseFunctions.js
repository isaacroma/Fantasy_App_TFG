import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config'; 

let app = null;
let firestore = null;

//Inicializa la app de Firebase
export const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  return app;
};

//Inicializa Firestore
export const initializeFirestore = () => {
    firestore = getFirestore(app);
    return firestore;
}

//Obtiene la instancia de autenticación de Firebase
export const getFirebaseAuth = () => {
  const auth = getAuth(app);
  return auth;
};

//Función para registrar un nuevo usuario
export const registerUser = (auth, email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

//Función para iniciar sesión
export const loginUser = (auth, email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};