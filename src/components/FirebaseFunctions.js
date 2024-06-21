import React from 'react';
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
let obtainAllLeaguesFunction = null;
let searchLeagueFunction = null;
let joinLeagueFunction = null;
let addFavoritePlayerFunction = null;
let getGeneralClassificationFunction = null;
let getMarketPlayersFunction = null;
let getUserTeamFunction = null;
let placeBidFunction = null;
let updateMarketFunction = null;
let sellPlayerFunction = null;
let alignPlayerFunction = null;
let getPlayerOwnerFunction = null;
let getPlayerBidsFunction = null;
let deletePlayerBidsFunction = null;
let playRoundFunction = null;
let getUserLanguageFunction = null;
let changeUserLanguageFunction = null;
let getUserFavPlayersFunction = null;
let deleteFavoritePlayerFunction = null;
let changeUserMultiplierFunction = null;
let getUserInfoFunction = null;
let leaveLeagueFunction = null;

//Inicializa la app de Firebase
export const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  registerUser = httpsCallable(getFunctions(app), 'createUser');
  createLeagueFunction = httpsCallable(getFunctions(app), 'createLeague');
  obtainPlayersFunction = httpsCallable(getFunctions(app), 'obtainPlayers');
  searchPlayerFunction = httpsCallable(getFunctions(app), 'searchPlayer');
  filterPlayersByPositionFunction = httpsCallable(getFunctions(app), 'filterPlayersByPosition');
  filterPlayersByPriceFunction = httpsCallable(getFunctions(app), 'filterPlayersByPrice');
  obtainAllLeaguesFunction = httpsCallable(getFunctions(app), 'obtainAllLeagues');
  joinLeagueFunction = httpsCallable(getFunctions(app), 'joinLeague');
  addFavoritePlayerFunction = httpsCallable(getFunctions(app), 'addFavoritePlayer');
  getGeneralClassificationFunction = httpsCallable(getFunctions(app), 'getGeneralClassification');
  getMarketPlayersFunction = httpsCallable(getFunctions(app), 'getMarketPlayers');
  getUserTeamFunction = httpsCallable(getFunctions(app), 'getUserTeam');
  placeBidFunction = httpsCallable(getFunctions(app), 'placeBid');
  updateMarketFunction = httpsCallable(getFunctions(app), 'updateMarketPlayers');
  sellPlayerFunction = httpsCallable(getFunctions(app), 'sellPlayer');
  alignPlayerFunction = httpsCallable(getFunctions(app), 'alignPlayer');
  getPlayerOwnerFunction = httpsCallable(getFunctions(app), 'getPlayerOwner');
  getPlayerBidsFunction = httpsCallable(getFunctions(app), 'getPlayerBids');
  deletePlayerBidsFunction = httpsCallable(getFunctions(app), 'deletePlayerBid');
  playRoundFunction = httpsCallable(getFunctions(app), 'playRound');
  getUserLanguageFunction = httpsCallable(getFunctions(app), 'getUserLanguage');
  changeUserLanguageFunction = httpsCallable(getFunctions(app), 'changeUserLanguage');
  getUserFavPlayersFunction = httpsCallable(getFunctions(app), 'getUserFavPlayers');
  deleteFavoritePlayerFunction = httpsCallable(getFunctions(app), 'deleteFavoritePlayer');
  changeUserMultiplierFunction = httpsCallable(getFunctions(app), 'changeUserMultiplier');
  getUserInfoFunction = httpsCallable(getFunctions(app), 'getUserInfo');
  leaveLeagueFunction = httpsCallable(getFunctions(app), 'leaveLeague');
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
  return createLeagueFunction({leagueName: leagueName})
  .then((result) => {
    const response = result.data;
    return response;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })     
};

//Función que devuelve la Liga con el nombre especificado
export const searchLeague = async (leagueName) => {
  return searchLeagueFunction({leagueName: leagueName})
  .then((result) => {
    const leagues = result.data.leaguesData;
    return leagues;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

//Función que devuelve todas las ligas
export const searchAllLeagues = async () => {
  return obtainAllLeaguesFunction()
  .then((result) => {
    const leagues = result.data.leaguesData;
    return leagues;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

///Función para crear un documento en la colección "Leagues" asociada al usuario logueado
export const joinLeague = async (leagueName) => {
  return joinLeagueFunction({leagueName: leagueName})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
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

//Función para añadir un jugador a favoritos
export const addFovoritePlayer = async (playerName) => {
  return addFavoritePlayerFunction({playerName: playerName})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const getGeneralClassification = async() => {
  return getGeneralClassificationFunction()
  .then((result) => {
    const members = result.data.members;
    return members;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

export const getMarketPlayers = async() => {
  return getMarketPlayersFunction()
  .then((result) => {
    const marketPlayers = result.data.marketPlayers;
    return marketPlayers;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

export const getUserTeam = async() => {
  return getUserTeamFunction()
  .then((result) => {
    const user = result.data.member;
    return user;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

export const placeBid = async (playerName, bid, date) => {
  return placeBidFunction({playerName: playerName, bid: bid, date: date})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

export const updateMarketPlayers = async () => {
  return updateMarketFunction()
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

export const addPlayersToFirestore = async (players) => {
  try {
    const db = getFirestore(app);
    const playersCollection = collection(db, 'Players');

    for (const player of players) {
      await addDoc(playersCollection, player);
    }
    return true;
  } catch (error) {
      console.log('Error: ' + error);
      console.log('Error message: ' + error.message);
      return false;
  }
};

//Función para vender un jugador
export const sellPlayer = async (playerName, price) => {
  return sellPlayerFunction({playerName: playerName, price: price})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
}

export const alignPlayer = async (actualPlayer, newPlayer) => {
  return alignPlayerFunction({actualPlayer: actualPlayer, newPlayer: newPlayer})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const getPlayerOwner = async (playerName) => {
  return getPlayerOwnerFunction({playerName: playerName})
  .then((result) => {
    const owner = result.data.owner;
    return owner;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const getPlayerBids = async () => {
  return getPlayerBidsFunction()
  .then((result) => {
    const bids = result.data.playerBids;
    return bids;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const deletePlayerBid = async (playerName) => {
  return deletePlayerBidsFunction({playerName: playerName})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const playRound = async () => {
  return playRoundFunction()
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const getUserLanguage = async () => {
  return getUserLanguageFunction()
  .then((result) => {
    const language = result.data.language;
    return language;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const changeUserLanguage = async (language) => {
  return changeUserLanguageFunction({language: language})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const getUserFavPlayers = async () => {
  return getUserFavPlayersFunction()
  .then((result) => {
    const favoritePlayers = result.data.favoritePlayers;
    return favoritePlayers;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const deleteFavoritePlayer = async (playerName) => {
  return deleteFavoritePlayerFunction({playerName: playerName})
  .then((result) => {
    console.log(result);
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const changeUserMultiplier = async (multiplier) => {
  return changeUserMultiplierFunction({multiplier: multiplier})
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const getUserInfo = async () => {
  return getUserInfoFunction()
  .then((result) => {
    const userInfo = result.data.userInfo;
    return userInfo;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};

export const leaveLeague = async () => {
  return leaveLeagueFunction()
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log('Error: ' + error);
    console.log('Error message: ' + error.message);
  })
};



