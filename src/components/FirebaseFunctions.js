import React from 'react';
import { Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, getDoc, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config';
import { getFunctions, httpsCallable } from 'firebase/functions';

let app = null;
let firestore = null;
let registerUser = null;
let createLeagueFunction = null;
let obtainPlayersFunction = null;
let searchPlayerFunction = null;
let filterPlayersByPositionFunction = null;
let filterPlayersByPriceFunction = null;

//Inicializa la app de Firebase
export const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  registerUser = httpsCallable(getFunctions(app), 'createUser');
  createLeagueFunction = httpsCallable(getFunctions(app), 'createLeague');
  obtainPlayersFunction = httpsCallable(getFunctions(app), 'obtainPlayers');
  searchPlayerFunction = httpsCallable(getFunctions(app), 'searchPlayer');
  filterPlayersByPositionFunction = httpsCallable(getFunctions(app), 'filterPlayersByPosition');
  filterPlayersByPriceFunction = httpsCallable(getFunctions(app), 'filterPlayersByPrice');
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

//Función para crear un nuevo usuario
export const createUser = async (auth, username, email, password) => {

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  registerUser({ email: email, userId: userCredential.user.uid, username: username })
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  });
};

//Función para iniciar sesión
export const loginUser = (auth, email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

//Función para cerrar sesión
export const signOutUser = (auth) => {
  return signOut(auth);
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
  
  createLeagueFunction({leagueName: leagueName})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })     
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

//Funcion para comprobar si hay un usuario logueado
export const checkloggedUser = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (user) {
    console.log('Logged in user: ' + user.uid);
  } else {
    console.log('No user logged in');
  }
}

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
        members: arrayUnion({userId: user.uid, points: 0, favoritePlayers: []})
      });

      
      const userDocRef = doc(db, 'Users', user.uid);            

      await updateDoc(userDocRef, {
        league: querySnapshot.docs[0].id
      });

      console.log('Usuario se ha unido a la liga');
      return true;
    }
        
  } catch (error) {
      console.error('Error al unirse a una liga:', error);
      return false; 
  }
};

//Función que devuelve todos los jugadores
export const obtainPlayers = async() => {
  return obtainPlayersFunction()
  .then((result) => {
    const players = result.data.playersData;
    return players;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

//Función que devuelve el jugador con el nombre especificado
export const searchPlayer = async (playerName) => {
  return searchPlayerFunction({playerName: playerName})
  .then((result) => {
    const players = result.data.playersData;
    return players;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

//Función que filtra los jugadores segun la posicion
export const filterPlayersByPosition = async (position) => {
  return filterPlayersByPositionFunction({position: position})
  .then((result) => {
    const players = result.data.playersData;
    return players;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

export const filterPlayersByPrice = async (min, max) => {
  return filterPlayersByPriceFunction({min: min, max: max})
  .then((result) => {
    const players = result.data.playersData;
    return players;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

//Función para registrar un nuevo usuario
export const addFovoritePlayer = async (playerName) => {
  try {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const db = getFirestore(app);
    const userDocRef = doc(db, 'Users', user.uid);

    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      const leagueDocRef = doc(db, 'Leagues', userData.league);
      const docSnapshot = await getDoc(leagueDocRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const members = data.members;
        for (const member of members) {
          if (member.userId === user.uid) {
              const favoritePlayers = member.favoritePlayers;
              if (!favoritePlayers.includes(playerName)) {
                  member.favoritePlayers = [...favoritePlayers, playerName];
                  break;
              }
          }
        }
        await updateDoc(leagueDocRef, { members: members });

        return true;
      }
    } 
  } catch (error) {
    console.error('Error al añadir un jugador a favoritos:', error);
    return false; 
  }
};

