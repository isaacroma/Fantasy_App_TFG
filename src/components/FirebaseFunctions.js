import React from 'react';
import { Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, getDoc, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
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
export const registerUser = async (auth, username, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  const db = getFirestore(app);
  const usersCollection = collection(db, 'Users');


  // Obtiene el usuario creado
  const user = userCredential.user;

  // Almacena el nombre de usuario en la base de datos
  await setDoc(doc(db, 'Users', user.uid), {
    email: email,
    username: username
  });

  return user;

};

//Función para iniciar sesión
export const loginUser = (auth, email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const getUserLeague = async () => {
  try {
    const auth = getAuth(app);
    const user = auth.currentUser;

    const db = getFirestore(app);

    const userDocRef = doc(db, 'Users', user.uid);

    // Obtener el documento del usuario actual
    const userDocSnap = await getDoc(userDocRef);

    const userData = userDocSnap.data();

    // El usuario tiene una liga asignada
    if (userData.league) {
      return 1; 
    } else {
      return 0;
    }

  } catch (error) {
      console.error('Error al buscar la liga del usuario al hacer login:', error);
      return false; 
  }
}

//Función para crear un documento en la colección "Leagues" asociada al usuario logueado
export const createLeague = async (leagueName) => {
    try {
        const auth = getAuth(app);
        const user = auth.currentUser;
    
        const db = getFirestore(app);
        const leaguesCollection = collection(db, 'Leagues');

        const leagueQuery = query(leaguesCollection, where('name', '==', leagueName));
        const querySnapshot = await getDocs(leagueQuery);

        if (!querySnapshot.empty) {
            throw new Error('Ya existe una liga con este nombre');
        } else {
            const memberData = {
                email: user.email
            };
                
            // Crear el documento en la colección "Leagues" con el nombre proporcionado
            await addDoc(leaguesCollection, {
                name: leagueName,
                ownerId: user.uid,
                members:  [memberData]
            });

            const userDocRef = doc(db, 'Users', user.uid);            

            await updateDoc(userDocRef, {
              league: leagueName
            });
            
            return true; 
        }  
    } catch (error) {
        console.error('Error al crear el documento de liga:', error);
        return false; 
    }
};

//Función que devuelve la Liga con el nombre especificado
export const searchLeague = async (leagueName) => {
  try {
    // Crea una consulta para buscar documentos en la colección "Leagues" con el nombre proporcionado
    const db = getFirestore(app);
    const leaguesCollection = collection(db, 'Leagues');
    const leagueQuery = query(leaguesCollection, where('name', '>=', leagueName), where('name', '<', leagueName + '\uf8ff'));

    // Ejecuta la consulta
    const querySnapshot = await getDocs(leagueQuery);

    const leagueData = [];
    // Itera sobre los resultados de la consulta
    querySnapshot.forEach((doc) => {
      // Accede a los datos del documento
      const data = doc.data();
      leagueData.push(data);
    });

    // Devuelve los datos de las ligas encontradas
    return leagueData;
    
  } catch (error) {
      console.error('Error al buscar una liga:', error);
      return false; 
  }
};

//Función que devuelve todas las ligas
export const searchAllLeagues = async () => {
  
  try {
    const db = getFirestore(app);
    const leaguesCollection = collection(db, 'Leagues');

    //Devuelve todas las ligas
    const querySnapshot = await getDocs(leaguesCollection);

    const leagueData = [];
    // Itera sobre los resultados de la consulta
    querySnapshot.forEach((doc) => {
      // Accede a los datos del documento
      const data = doc.data();
      leagueData.push(data);
    });

    // Devuelve los datos de las ligas encontradas
    return leagueData;

  } catch (error) {
      console.error('Error al buscar todas las ligas:', error);
      return false; 
  }
};

///Función para crear un documento en la colección "Leagues" asociada al usuario logueado
export const joinLeague = async (leagueName) => {
  try {
      const auth = getAuth(app);
      const user = auth.currentUser;
  
      const db = getFirestore(app);
      const leaguesCollection = collection(db, 'Leagues');

      const leagueQuery = query(leaguesCollection, where('name', '==', leagueName));
      const querySnapshot = await getDocs(leagueQuery);
          
      // Verifica si se encontraron documentos
    if (!querySnapshot.empty) {
      // Obtiene la referencia del primer documento encontrado
      const leagueDocRef = doc(db, 'Leagues', querySnapshot.docs[0].id);

      // Verifica si el usuario ya es miembro de la liga
      const leagueData = querySnapshot.docs[0].data();
      const isMember = leagueData.members.some(member => member.email === user.email);

      if (isMember) {
        Alert.alert('El usuario ya es miembro de esta liga');
        return false;
      }

      // Actualiza el documento para añadir al nuevo miembro al array "members"
      await updateDoc(leagueDocRef, {
        members: arrayUnion({email: user.email})
      });

      console.log('Usuario se ha unido a la liga');
      return true;
    }
        
  } catch (error) {
      console.error('Error al unirse a una liga:', error);
      return false; 
  }
};

