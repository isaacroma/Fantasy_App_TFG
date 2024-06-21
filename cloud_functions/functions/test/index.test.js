const firebase = require('@firebase/testing');
const admin = require("firebase-admin");
const testFunctions = require('firebase-functions-test')();

const projectId = "fantasy-app-b5152";
process.env.GCLOUD_PROJECT = projectId;
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
let app = admin.initializeApp({projectId});
let db = firebase.firestore(app);

const myFunctions = require('../index');


const { createUser, createLeague, getUserLeague, joinLeague, obtainAllLeagues, searchLeague, obtainPlayers, 
filterPlayersByPosition, filterPlayersByPrice, searchPlayer, addFavoritePlayer, getPlayerInfo, getRandomPlayers, 
getGeneralClassification, getMarketPlayers, updateMarketPlayers, getUserTeam, placeBid, sellPlayer, alignPlayer, 
getPlayerOwner, getPlayerBids, deletePlayerBid, playRound, getUserLanguage, changeUserLanguage, getUserFavPlayers, 
deleteFavoritePlayer, changeUserMultiplier, getUserInfo, leaveLeague } = myFunctions;

//Test create user
test('createUser should create a user successfully', async () => {
  // Context & Data
  const data = { email: 'user2@gmail.com', userId: 'Ip0RqttDvOvh9SSooG2tJOxP2747', username: 'user2' };
  const wrapped = testFunctions.wrap(createUser);
  const result = await wrapped(data);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test get user league
test('getUserLeague should return user leagu successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(getUserLeague);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true, league: 0 });

});

//Test create League
test('createLeague should create a league successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { leagueName: 'Test League 1' };
  const wrapped = testFunctions.wrap(createLeague);
  const result = await wrapped(data, context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test create League with existing League Name
test('createLeague should return false because we are trying to create a league with an existing leagueName', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { leagueName: 'Test League 1' };
  const wrapped = testFunctions.wrap(createLeague);
  const result = await wrapped(data, context);
 
  // Verification
  expect(result).toEqual({ success: false });
});

//Test join League
test('joinLeague should allow a user to join a league successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { leagueName: 'Test League 1' };
  const wrapped = testFunctions.wrap(joinLeague);
  const result = await wrapped(data, context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test obtain all leagues
test('obtainAllLeagues should return all leagues', async () => {
  // Llama a la función con los datos de prueba y el contexto
  const wrapped = testFunctions.wrap(obtainAllLeagues);
  const result = await wrapped();
  console.log(result);
 
  // Verifica que la función devuelve el resultado esperado
  expect(Array.isArray(result)).toBe(true);
});

//Test search league
test('searchLeague should return the league with the same name as the one passed as a paremeter', async () => {
  // Context & Data
  const data = { leagueName: 'liga1'};
  const wrapped = testFunctions.wrap(searchLeague);
  const result = await wrapped(data);
  console.log(result);
 
  // Verification
  expect(Array.isArray(result)).toBe(true);
});

//Test obtain all players
test('obtainPlayers should return all players', async () => {
  // Context & Data
  const wrapped = testFunctions.wrap(obtainPlayers);
  const result = await wrapped();
  console.log(result);
 
  // Verification
  expect(Array.isArray(result)).toBe(true);
});

//Test filter players depending on their position
test('filterPlayersByPosition should return all players with position equal to the position passed as a parameter', async () => {
  // Context & Data
  //const data = { min: 'DC' };
  //const data = { min: 'MC' };
  //const data = { min: 'POR' };
  const data = { min: 'DFC' };
  const wrapped = testFunctions.wrap(filterPlayersByPosition);
  const result = await wrapped(data);
  console.log(result);
 
  // Verification
  expect(Array.isArray(result)).toBe(true);
});

//Test filter players depending on their price
test('filterPlayersByPrice should return all players wuth price between the price range passed as a parameter', async () => {
  // Context & Data
  //const data = { min: 10000000, max: 99999999};
  //const data = { min: 10000000, max: 5000000};
  //const data = { min: 5000000, max: 10000000};
  const data = { min: 0, max: 1000000};
  const wrapped = testFunctions.wrap(filterPlayersByPrice);
  const result = await wrapped(data);
  console.log(result);
 
  // Verification
  expect(Array.isArray(result)).toBe(true);
});

//Test search player
test('searchPlayer should return the player with the same name as the one passed as a paremeter', async () => {
  // Context & Data
  //const data = { playerName: 'pedri'};
  //const data = { playerName: 'p'};
  const data = { playerName: 'ter'};
  const wrapped = testFunctions.wrap(searchPlayer);
  const result = await wrapped(data);
  console.log(result);
 
  // Verificatio
  expect(Array.isArray(result)).toBe(true);
});

//Test add favorite player
test('addFavoritePlayer should add the player with the name passed as a parameter to the user favorite players list', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { playerName: 'Pedri' };
  const wrapped = testFunctions.wrap(addFavoritePlayer);
  const result = await wrapped(data, context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test get League clasification
test('getGeneralClassification should return the league classification successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(getGeneralClassification);
  const result = await wrapped(context);
  console.log(result);
 
  // Verification
  expect(Array.isArray(result.members)).toBe(true);
 
});

//Test update market players
test('updateMarketPlayers should update market players and check player bids successfully', async () => {
  // Context & Data
  const wrapped = testFunctions.wrap(updateMarketPlayers);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test get market players
test('getMarketPlayers should return all market players successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(getMarketPlayers);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test get user team
test('getUserTeam should return user team successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(getUserTeam);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test place bid
test('placeBid should add the a bid to the player with the same aname as the one passed as a parameter', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { bid: 15000000, date: '2024-05-1T17:45:43.874Z', playerName: 'Pedri' };
  const wrapped = testFunctions.wrap(placeBid);
  const result = await wrapped(data, context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test sell player
test('sellPlayer should delete the player with the same name as the one passed as a parameter from the user team', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { playerPrice: 15000000, playerName: 'Pedri' };
  const wrapped = testFunctions.wrap(sellPlayer);
  const result = await wrapped(data, context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test align player
test('alignPlayer should add a player to the user aligned players successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  //const data = {newPlayer: 'Pedri' , actualPlayer: '' };
  const data = {newPlayer: 'Frenkie De Jong' , actualPlayer: 'Pedri' };
  const wrapped = testFunctions.wrap(alignPlayer);
  const result = await wrapped(data, context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test get player owner
test('getPlayerOwner should return the player owner sucessfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { playerName: 'Pedri' };
  const wrapped = testFunctions.wrap(getPlayerOwner);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test get player bids
test('getPlayerBids should return all the bids of the user successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(getPlayerBids);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test delete player bid
test('deletePlayerBid should delete the bid of the user successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { playerName: 'Pedri' };
  const wrapped = testFunctions.wrap(deletePlayerBid);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test play round
test('playRound should play a round successfully', async () => {
  // Context & Data
  const wrapped = testFunctions.wrap(playRound);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});


//Test get user language
test('getUserLanguage should return user language successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(getUserLanguage);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test change user language
test('changeUserLanguage should change user language successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { language: 'en' };
  const wrapped = testFunctions.wrap(changeUserLanguage);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test get user favorite players
test('getUserFavPlayers should return user language successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(getUserFavPlayers);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test delete favorite player
test('deleteFavoritePlayer should delete the favorite player of the users favorite players list successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { playerName: 'Pedri' };
  const wrapped = testFunctions.wrap(deleteFavoritePlayer);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test change user multiplier
test('changeUserMultiplier should update the user multiplier successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const data = { multiplier: 0.5 };
  const wrapped = testFunctions.wrap(changeUserMultiplier);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test get user info
test('getUserInfo should return user info successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(getUserInfo);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

//Test leave league
test('leaveLeague should delete the user from the league members successfully', async () => {
  // Authentication context to simulate an authenticated user
  const context = {
     auth: {
       uid: 'Ip0RqttDvOvh9SSooG2tJOxP2747',
       token: {
         firebase: {
           email_verified: false
         }
       }
     }
  };
 
  // Context & Data
  const wrapped = testFunctions.wrap(leaveLeague);
  const result = await wrapped(context);
 
  // Verification
  expect(result).toEqual({ success: true });
});

afterAll(async () => {
  await admin.firestore().terminate();
}); 