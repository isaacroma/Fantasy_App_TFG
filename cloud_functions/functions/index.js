const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const functions = require('firebase-functions');
const { getFirestore, collection, setDoc, doc } = require('firebase/firestore');

if (!admin.apps.length) {
    // Si no existe, inicializa la aplicación
    admin.initializeApp({
       credential: admin.credential.applicationDefault(),
       // Aquí puedes agregar otras opciones de configuración si es necesario
    });
}

//Function that creates a user on the database
exports.createUser =  functions.https.onCall(async (data) => {
    try {
        const userId = data.userId;
        const email = data.email;
        const username = data.username;
        const db = admin.firestore();
        const usersCollection = db.collection('Users');
    
        await usersCollection.doc(userId).set({
            email: email,
            username: username,
            language: 'es'
        });

        return { success: true };

    } catch (error) {
        console.error('Error in createUser function:', error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});

//Function that checks if a user is member of a league
exports.getUserLeague = functions.https.onCall(async (data, context) => {
    try {
        const user = context.auth;

        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        const userData = userDocSnap.data();
 
        if (userData.league) {
            return { success: true, league: 1 };
        } else {
            return { success: true, league: 0 };
        }

    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that creates a League
exports.createLeague = functions.https.onCall(async (data, context) => {
    try {
        const leagueName = data.leagueName;
        const user = context.auth; 
    
        const db = admin.firestore();
        const leaguesCollection = db.collection('Leagues');
        const playersCollection = db.collection('Players');
        const marketPlayersCollection = db.collection('MarketPlayers');
        const freePlayersCollection = db.collection('FreePlayers');
        const playerBidsCollection = db.collection('PlayerBids');
    
        const leagueQuery = leaguesCollection.where('name', '==', leagueName);
        const leagueQuerySnap = await leagueQuery.get();
    
        if (!leagueQuerySnap.empty) {
            return { success: false, error: 'A league with this name already exists' };
        } else {

            const userDocRef = db.collection('Users').doc(user.uid);

            const userDocSnap = await userDocRef.get();

            if (userDocSnap.exists) {

                const playersSnap = await playersCollection.get();
                const players = playersSnap.docs.map(doc => doc.data());

                const assignedPlayers = [];
                for (let i = 0; i < 11; i++) {
                    const randomIndex = Math.floor(Math.random() * players.length);
                    assignedPlayers.push(players[randomIndex]);
                    players.splice(randomIndex, 1);
                }

                const memberData = {
                    userId: user.uid,
                    username: userDocSnap.data().username,
                    points: 0,
                    favoritePlayers: [],
                    alignedPlayers: [],
                    team: assignedPlayers,
                    money: 25000000,
                    multiplier: 0.1
                };
        
                const newLeagueRef = await leaguesCollection.add({
                    name: leagueName,
                    ownerId: user.uid,
                    members: [memberData]
                });
        
                const leagueId = newLeagueRef.id;
        
                await userDocRef.update({
                    league: leagueId
                });

                //FreePlayers = players - assignedPlayers
                await freePlayersCollection.doc(leagueId).set({ players: players });

                const randomPlayers = [];
                for (let i = 0; i < 10; i++) {
                    const randomIndex = Math.floor(Math.random() * players.length);
                    randomPlayers.push(players[randomIndex]);
                    players.splice(randomIndex, 1);
                }

                await marketPlayersCollection.doc(leagueId).set({ players: randomPlayers });
                
                await playerBidsCollection.doc(leagueId).set({ bids: [] });
        
                return { success: true };
            }
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that allows a user to join a League
exports.joinLeague = functions.https.onCall(async (data, context) => {
    try {
        const leagueName = data.leagueName;
        const user = context.auth;

        const db = admin.firestore();
        const leaguesCollection = db.collection('Leagues');
  
        const leagueQuery = leaguesCollection.where('name', '==', leagueName);
        const leagueQuerySnap = await leagueQuery.get();
            
      if (!leagueQuerySnap.empty) {

        const leagueDocRef = leaguesCollection.doc(leagueQuerySnap.docs[0].id);
  
        const leagueData = leagueQuerySnap.docs[0].data();
        const isMember = leagueData.members.some(member => member.userId === user.uid);
  
        if (isMember) {
            throw new functions.https.HttpsError('already-exists', 'The user is member of this league');
        }

        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data();

            const marketPlayersRef = db.collection('MarketPlayers').doc(leagueQuerySnap.docs[0].id);
            const marketPlayersSnap = await marketPlayersRef.get();
            const marketPlayersData = marketPlayersSnap.data();
            const marketPlayers = marketPlayersData.players;
    
            const freePlayersRef = db.collection('FreePlayers').doc(leagueQuerySnap.docs[0].id);
            const freePlayersSnap = await freePlayersRef.get();
            const freePlayersData = freePlayersSnap.data();
            const freePlayers = freePlayersData.players;

            const players = freePlayers.filter(freePlayer => 
                !marketPlayers.some(marketPlayer => marketPlayer.name === freePlayer.name)
            );

            const assignedPlayers = [];
            for (let i = 0; i < 11; i++) {
                const randomIndex = Math.floor(Math.random() * players.length);
                assignedPlayers.push(players[randomIndex]);
                players.splice(randomIndex, 1);
            }

            await freePlayersRef.update({
                players: admin.firestore.FieldValue.arrayRemove(...assignedPlayers)
            });

            await leagueDocRef.update({
                members: admin.firestore.FieldValue.arrayUnion({userId: user.uid, username: userData.username, points: 0, favoritePlayers: [], alignedPlayers: [], team: assignedPlayers, money: 25000000, multiplier: 0.1})
            });           
      
            await userDocRef.update({
                league: leagueQuerySnap.docs[0].id
            });
      
            return { success: true };
        }

      } else {
        throw new functions.https.HttpsError('not-found', 'A league with this name doesnt exist');
      }
          
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns all the leagues
exports.obtainAllLeagues = functions.https.onCall(async () => {
    try {
       const db = admin.firestore();
       const leaguesCollection = db.collection('Leagues');
   
       const leaguesSnap = await leaguesCollection.get();
   
       const leaguesData = [];

       leaguesSnap.forEach((doc) => {
         const data = doc.data();
         leaguesData.push(data);
       });
   
       return {success: true, leaguesData};
   
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns a league depending on the name
exports.searchLeague = functions.https.onCall(async (data) => {
    try {
       const leagueName = data.leagueName;
       const normalizedLeagueName = leagueName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
       const db = admin.firestore();
       const leaguesCollection = db.collection('Leagues');
   
       const leaguesQuery = leaguesCollection;
   
       const leaguesQuerySnap = await leaguesQuery.get();
   
       const leaguesData = [];

       leaguesQuerySnap.forEach((doc) => {
            const leagueData = doc.data();
            const normalizedName = leagueData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (normalizedName.includes(normalizedLeagueName)) {
                leaguesData.push(leagueData);
            }
        });
   
       return {success: true, leaguesData};
   
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns all the players
exports.obtainPlayers = functions.https.onCall(async (data, context) => {
    try {
       const db = admin.firestore();
       const playersCollection = db.collection('Players');
   
       const playersSnap = await playersCollection.get();
   
       const playersData = [];

       playersSnap.forEach((doc) => {
            const data = doc.data();
            playersData.push(data);
       });
   

       return {success: true, playersData};
   
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that filters all the players by the position
exports.filterPlayersByPosition = functions.https.onCall(async (data) => {
    try {
       const position = data.position;
       const db = admin.firestore();
       const playersCollection = db.collection('Players');

       const playersQuery = playersCollection.where('position', '==', position);

       const playersQuerySnap = await playersQuery.get();
   
       const playersData = [];

       playersQuerySnap.forEach((doc) => {
            const data = doc.data();
            playersData.push(data);
       });
   
       return {success: true, playersData};
   
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that filters all the players by the price
exports.filterPlayersByPrice = functions.https.onCall(async (data) => {
    try {
       const min = data.min;
       const max = data.max;
       const db = admin.firestore();
       const playersCollection = db.collection('Players');
   
       const playersQuery = playersCollection.where('price', '>=', min).where('price', '<=', max);
   
       const playersQuerySnap = await playersQuery.get();
   
       const playersData = [];

       playersQuerySnap.forEach((doc) => {
         const data = doc.data();
         playersData.push(data);
       });
   
       return {success: true, playersData};
   
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns a player depending on the name
exports.searchPlayer = functions.https.onCall(async (data) => {
    try {
       const playerName = data.playerName;
       const normalizedPlayerName = playerName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
       const db = admin.firestore();
       const playersCollection = db.collection('Players');
   
       const playersQuery = playersCollection;
   
       const playersQuerySnap = await playersQuery.get();
   
       const playersData = [];

       playersQuerySnap.forEach((doc) => {
            const playerData = doc.data();
            const normalizedName = playerData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (normalizedName.includes(normalizedPlayerName)) {
                playersData.push(playerData);
            }
        });
   
       return {success: true, playersData};
   
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that adds a player to the favorite players list of a user
exports.addFavoritePlayer = functions.https.onCall (async (data, context) => {
    try {
        const playerName = data.playerName;
        const user = context.auth;

        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueDocRef = db.collection('Leagues').doc(userData.league);
            const leagueDocSnap = await leagueDocRef.get();

            if (leagueDocSnap.exists) {
                const leagueData = leagueDocSnap.data();
                const members = leagueData.members;

                for (const member of members) {
                    if (member.userId === user.uid) {
                        const favoritePlayers = member.favoritePlayers || [];
                        if (!favoritePlayers.includes(playerName)) {
                            favoritePlayers.push({name: playerName});
                            member.favoritePlayers = favoritePlayers;
                            break;
                        }
                    }
                }
                await leagueDocRef.update({ members: members });
            }
        }

        return {success: true}

    } catch (error) {
        return { success: false, error: error.message };
    }
})

//Function that returns the general classification of a league
exports.getGeneralClassification = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if(userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueDocRef = db.collection('Leagues').doc(userData.league);
            const leagueDocSnap = await leagueDocRef.get();
            const leagueData = leagueDocSnap.data();
            let members = leagueData.members;

            members.sort((a, b) => b.points - a.points);

            return { success: true, members };
        }

    } catch (error) {
        return { success: false, error: error.message };
    }
})

//Function that updates the market players and checks all player bids
exports.updateMarketPlayers = functions.https.onCall (async (data, context) => {
    try {
        const db = admin.firestore();
        const leaguesCollection = db.collection('Leagues');
        const marketPlayersCollection = db.collection('MarketPlayers');
        const playerBidsCollection = db.collection('PlayerBids');
    
        const leaguesSnap = await leaguesCollection.get();
        
        for (const leagueDoc of leaguesSnap.docs) {
            const leagueData = leagueDoc.data();
            const leagueId = leagueDoc.id;
            const playerBidsRef = playerBidsCollection.doc(leagueId);
            const playerBidsSnap = await playerBidsRef.get();
            const playerBidsData = playerBidsSnap.data();

            const leagueRef = db.collection('Leagues').doc(leagueId);

            if(playerBidsData.bids.length > 0) {

                for (const bid of playerBidsData.bids) {
                    const playerName = bid.playerName;
                    const freePlayersRef = db.collection('FreePlayers').doc(leagueId);
                    const freePlayersSnap = await freePlayersRef.get();
                    const freePlayersData = freePlayersSnap.data();
    
                    const playerIndex = freePlayersData.players.findIndex(player => player.name === playerName);
                    
                    if (playerIndex !== -1) {
                        const playerData = freePlayersData.players[playerIndex];
                        freePlayersData.players.splice(playerIndex, 1);
                        await freePlayersRef.update({ players: freePlayersData.players });
    
                        const sortedBids = bid.users.sort((a, b) => {
                            if (a.bid!== b.bid) {
                                return b.bid - a.bid;
                            }
                            return new Date(a.date) - new Date(b.date);
                        });
                        
                        const highestBidUser = sortedBids[0];
    
                        const userIndex = leagueData.members.findIndex(member => member.userId === highestBidUser.userId);
    
                        leagueData.members[userIndex].team.push(playerData);
                        leagueData.members[userIndex].money -= highestBidUser.bid;
    
                        await leagueRef.update({
                            members: leagueData.members
                        });
                    }
                }

                await playerBidsRef.update({ bids: [] });
            }

            const updatedFreePlayersRef = db.collection('FreePlayers').doc(leagueId);
            const updatedFreePlayersSnap = await updatedFreePlayersRef.get();
            const updatedFreePlayersData = updatedFreePlayersSnap.data();
            const players = updatedFreePlayersData.players;

            const randomPlayers = [];
            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * players.length);
                randomPlayers.push(players[randomIndex]);
                players.splice(randomIndex, 1);
            }
            await marketPlayersCollection.doc(leagueId).set({ players: randomPlayers });

            const updatedPlayerBidsRef = db.collection('PlayerBids').doc(leagueId);
            const leagueMembers = leagueData.members;
            for (const member of leagueMembers) {
                const multiplier = member.multiplier;
                for (let j = 0; j < 10; j++) {
                    const FavPlayerIndex = member.favoritePlayers.findIndex(player => player.name === randomPlayers[j].name);
                    if (FavPlayerIndex != -1) {
                        const playerName = randomPlayers[j].name;
                        const bid = Math.floor(randomPlayers[j].price * (1 + multiplier));
                        if ((member.money - bid) >= 0) {
                            const date = new Date();
                            const formatedDate = date.toISOString();
                            const updatedPlayerBidsSnap = await updatedPlayerBidsRef.get();
                            if (updatedPlayerBidsSnap.exists) {
                                const updatedPlayerBidsData = updatedPlayerBidsSnap.data();
                                if(updatedPlayerBidsData.bids.length > 0) {
                                    const playerIndex = updatedPlayerBidsData.bids.findIndex(bid => bid.playerName === playerName);
                
                                    if (playerIndex !== -1) {
                                        const userBidIndex = updatedPlayerBidsData.bids[playerIndex].users.findIndex(userBid => userBid.userId === member.userId);
                    
                                        if (userBidIndex !== -1) {
                                            updatedPlayerBidsData.bids[playerIndex].users[userBidIndex].bid = bid;
                                            updatedPlayerBidsData.bids[playerIndex].users[userBidIndex].date = formatedDate;
                                        } else {
                                            updatedPlayerBidsData.bids[playerIndex].users.push({userId: member.userId, bid: bid, date: formatedDate});
                                        }
                                    } else {
                                        updatedPlayerBidsData.bids.push({
                                            playerName: playerName,
                                            users: [{userId: member.userId, bid: bid, date: formatedDate}]
                                        });
                                    }
                                } else {
                                    updatedPlayerBidsData.bids.push({
                                        playerName: playerName,
                                        users: [{userId: member.userId, bid: bid, date: formatedDate}]
                                    });
                                }
                                await updatedPlayerBidsRef.update({
                                    bids: updatedPlayerBidsData.bids
                                });
                            } else {
                                await playerBidsCollection.doc(leagueRef.id).set({
                                    bids: [{
                                        playerName: playerName,
                                        users: [{userId: member.userId, bid: bid, date: formatedDate}]
                                    }]
                                });
                            }
                        }
                    }
                }
            }
        }
        return {success: true};
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns all the players on the market
exports.getMarketPlayers = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const marketPlayersRef = db.collection('MarketPlayers').doc(userData.league);
            const marketPlayersSnap = await marketPlayersRef.get();
            const marketPlayersData = marketPlayersSnap.data();
            const marketPlayers = marketPlayersData.players;

            return {success: true, marketPlayers};
        }
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns the team of a user
exports.getUserTeam = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueRef = db.collection('Leagues').doc(userData.league);
            const leagueSnap = await leagueRef.get();
            const leagueData = leagueSnap.data();
            
            const members = leagueData.members;
            const member = members.find(member => member.userId === user.uid);

            return {success: true, member };
        }
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that places a bid for the player with the same name as the one passed as a parameter
exports.placeBid = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const bid = data.bid;
        const date = data.date;
        const playerName = data.playerName;
        const db = admin.firestore();

        const playerBidsCollection = db.collection('PlayerBids');

        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueRef = db.collection('Leagues').doc(userData.league);

            const playerBidsRef = playerBidsCollection.doc(leagueRef.id);
            const playerBidsSnap = await playerBidsRef.get();

            if (playerBidsSnap.exists) {
                const playerBidsData = playerBidsSnap.data();

                if(playerBidsData.bids.length > 0) {
                    const playerIndex = playerBidsData.bids.findIndex(bid => bid.playerName === playerName);

                    if (playerIndex !== -1) {
                        const userBidIndex = playerBidsData.bids[playerIndex].users.findIndex(userBid => userBid.userId === user.uid);
    
                        if (userBidIndex !== -1) {
                            playerBidsData.bids[playerIndex].users[userBidIndex].bid = bid;
                            playerBidsData.bids[playerIndex].users[userBidIndex].date = date;
                        } else {
                            playerBidsData.bids[playerIndex].users.push({userId: user.uid, bid: bid, date: date});
                        }
                
                    } else {
                        playerBidsData.bids.push({
                            playerName: playerName,
                            users: [{userId: user.uid, bid: bid, date: date}]
                        });
                    }
                } else {
                    playerBidsData.bids.push({
                        playerName: playerName,
                        users: [{userId: user.uid, bid: bid, date: date}]
                    });
                }

                await playerBidsRef.update({
                    bids: playerBidsData.bids
                });
            } else {
                await playerBidsCollection.doc(leagueRef.id).set({
                    bids: [{
                        playerName: playerName,
                        users: [{userId: user.uid, bid: bid, date: date}]
                    }]
                });
            }
            return {success: true};
        }           
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that sells the player of a user
exports.sellPlayer = functions.https.onCall (async (data, context) => {
    try {
        const playerName = data.playerName;
        const playerPrice = data.price;
        const user = context.auth;

        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueDocRef = db.collection('Leagues').doc(userData.league);
            const leagueDocSnap = await leagueDocRef.get();

            if (leagueDocSnap.exists) {
                const leagueData = leagueDocSnap.data();

                const userIndex = leagueData.members.findIndex(member => member.userId === user.uid);
                const userTeam = leagueData.members[userIndex].team;
                const userAlignedPlayers = leagueData.members[userIndex].alignedPlayers;

                const playerIndex = userTeam.findIndex(teamPlayer => teamPlayer.name === playerName);
                const alignedPlayerIndex = userAlignedPlayers.findIndex(alignedPlayer => alignedPlayer.name === playerName);

                if (playerIndex != -1) {
                    if(alignedPlayerIndex != -1) {
                        leagueData.members[userIndex].alignedPlayers.splice(alignedPlayerIndex, 1);
                    }
                    const player = userTeam[playerIndex];
        
                    leagueData.members[userIndex].team.splice(playerIndex, 1);
                    leagueData.members[userIndex].money += playerPrice;
    
                    await leagueDocRef.update({
                        members: leagueData.members
                    });
    
                    const freePlayersRef = db.collection('FreePlayers').doc(userData.league);
                    const freePlayersSnap = await freePlayersRef.get();
    
                    if (freePlayersSnap.exists) {
                        const freePlayersData = freePlayersSnap.data();
                        freePlayersData.players.push(player);
    
                        await freePlayersRef.update({
                            players: freePlayersData.players
                        });
                    }
                    return {success: true}
                }
            }
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that adds a player to the aligned players of the user
exports.alignPlayer = functions.https.onCall (async (data, context) => {
    try {
        const actualPlayer = data.actualPlayer;
        const newPlayer = data.newPlayer;
        const user = context.auth;

        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueDocRef = db.collection('Leagues').doc(userData.league);
            const leagueDocSnap = await leagueDocRef.get();

            if (leagueDocSnap.exists) {
                const leagueData = leagueDocSnap.data();
                const members = leagueData.members;

                for (const member of members) {
                    if (member.userId === user.uid) {
                        let alignedPlayers = member.alignedPlayers || [];
                        if (actualPlayer === '') {
                            alignedPlayers.push(newPlayer);
                        } else {
                            const playerIndex = alignedPlayers.findIndex(player => player.name === actualPlayer.name);
                            alignedPlayers[playerIndex] = newPlayer;
                        }
                        member.alignedPlayers = alignedPlayers;
                        break;          
                    }
                }
                await leagueDocRef.update({ members: members });
            }
        }

        return {success: true}

    } catch (error) {
        return { success: false, error: error.message };
    }
})

//Function that returns the owner of the player with the same name as the one passed as a parameter
exports.getPlayerOwner = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();
        const playerName = data.playerName;
        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueRef = db.collection('Leagues').doc(userData.league);
            const leagueSnap = await leagueRef.get();
            if(leagueSnap.exists) {
                const leagueData = leagueSnap.data();
            
                const members = leagueData.members;
                let owner = null;
                
                for (const member of members) {
                    const playerIndex = member.team.findIndex(player => player.name === playerName);
                    if(playerIndex != -1) {
                        owner = member.username;
                        break;
                    }                
                }

                return {success: true, owner };
            }
        }
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns all the bids of a user
exports.getPlayerBids = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();

        const playerBidsCollection = db.collection('PlayerBids');

        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueRef = db.collection('Leagues').doc(userData.league);

            const playerBidsRef = playerBidsCollection.doc(leagueRef.id);
            const playerBidsSnap = await playerBidsRef.get();
            
            if (playerBidsSnap.exists) {
                const bidsData = playerBidsSnap.data();
                const bids = bidsData.bids;
                let playerBids = [];
                for (const bid of bids) {
                    const playerName = bid.playerName;
                    const bidUsers = bid.users;
                    const userIndex = bidUsers.findIndex(bidUser => bidUser.userId === user.uid);
                    if(userIndex != -1) {
                        const price = bidUsers[userIndex].bid;
                        playerBids.push({price: price, playerName: playerName})
                    }            
                }
                return {success: true, playerBids };
            }
        }
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that deletes the bid of a user
exports.deletePlayerBid = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();
        const playerName = data.playerName;

        const playerBidsCollection = db.collection('PlayerBids');

        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueRef = db.collection('Leagues').doc(userData.league);

            const playerBidsRef = playerBidsCollection.doc(leagueRef.id);
            const playerBidsSnap = await playerBidsRef.get();
            
            if (playerBidsSnap.exists) {
                const playerBidsData = playerBidsSnap.data();
                const playerIndex = playerBidsData.bids.findIndex(bid => bid.playerName === playerName);

                if (playerIndex !== -1) {
                    const userBidIndex = playerBidsData.bids[playerIndex].users.findIndex(userBid => userBid.userId === user.uid);

                    if (userBidIndex !== -1) {
                        playerBidsData.bids[playerIndex].users.splice(userBidIndex, 1);

                        if (playerBidsData.bids[playerIndex].users.length === 0) {
                            playerBidsData.bids.splice(playerIndex, 1);
                        }

                        await playerBidsRef.update({
                            bids: playerBidsData.bids
                        });

                        return {success: true};
                    }
                }
            }
        }
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that updates all the player and user points
exports.playRound = functions.https.onCall (async (data, context) => {
    try {
        const db = admin.firestore();
        const leaguesCollection = db.collection('Leagues');
        const playersCollection = db.collection('Players');

        const playersSnap = await playersCollection.get();

        const players = [];
        for (const playerDoc of playersSnap.docs) {
            const playerDocRef = db.collection('Players').doc(playerDoc.id);
            const playerData = playerDoc.data();
            const roundPoints = Math.floor(Math.random() * (21 - (-5) + 1)) + (-5);
            playerData.points += roundPoints;
            playerData.seasons["2324"].points += roundPoints;
            players.push({
                playerName: playerData.name,
                points: roundPoints
            });

            await playerDocRef.update({
                points: playerData.points,
                ["seasons.2324.points"]: playerData.seasons["2324"].points
            });
        }

        const leaguesSnap = await leaguesCollection.get();
        
        for (const leagueDoc of leaguesSnap.docs) {
            const leagueData = leagueDoc.data();
            const leagueId = leagueDoc.id;

            const leagueRef = db.collection('Leagues').doc(leagueId);
            const freePlayersRef = db.collection('FreePlayers').doc(leagueId);
            const marketPlayersRef = db.collection('MarketPlayers').doc(leagueId);

            const freePlayersSnap = await freePlayersRef.get();
            const freePlayersData = freePlayersSnap.data();

            const marketPlayersSnap = await marketPlayersRef.get();
            const marketPlayersData = marketPlayersSnap.data();

            const leagueMembers = leagueData.members;

            for (const player of players) {

                const freePlayerIndex = freePlayersData.players.findIndex(freePlayer => freePlayer.name === player.playerName);
                const marketPlayerIndex = marketPlayersData.players.findIndex(marketPlayer => marketPlayer.name === player.playerName);

                if (freePlayerIndex != -1) {
                    freePlayersData.players[freePlayerIndex].points += player.points;
                    freePlayersData.players[freePlayerIndex].seasons["2324"].points += player.points;
                }

                if (marketPlayerIndex != -1) {
                    marketPlayersData.players[marketPlayerIndex].points += player.points;
                    marketPlayersData.players[marketPlayerIndex].seasons["2324"].points += player.points;
                }

                for (const member of leagueMembers) {
                    const alignedPlayerIndex = member.alignedPlayers.findIndex(alignedPlayer => alignedPlayer.name === player.playerName);
                    const teamPlayerIndex = member.team.findIndex(teamPlayer => teamPlayer.name === player.playerName);
                    if (alignedPlayerIndex != -1) {
                        member.points += player.points;
                        member.alignedPlayers[alignedPlayerIndex].points += player.points;
                        member.alignedPlayers[alignedPlayerIndex].seasons["2324"].points += player.points;
                    }
                    if (teamPlayerIndex != -1) {
                        member.team[teamPlayerIndex].points += player.points;
                        member.team[teamPlayerIndex].seasons["2324"].points += player.points;
                    }
                }
            }

            await leagueRef.update({
                members: leagueMembers
            });

            await freePlayersRef.update({
                players: freePlayersData.players
            });

            await marketPlayersRef.update({
                players: marketPlayersData.players
            });
        }

        return {success: true};
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns the language of a user
exports.getUserLanguage = functions.https.onCall(async (data, context) => {
    try {
        const user = context.auth;

        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const language = userData.language;
            return { success: true, language }
        }

    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that changes the language of a user
exports.changeUserLanguage = functions.https.onCall(async (data, context) => {
    try {
        const user = context.auth;
        const language = data.language;
        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {

            await userDocRef.update({
                language: language
            });

            return {success: true}
        }

    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns all the favorite players of a user
exports.getUserFavPlayers = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();

        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueRef = db.collection('Leagues').doc(userData.league);

            const leagueDocSnap = await leagueRef.get();
            
            if (leagueDocSnap.exists) {
                const leagueData = leagueDocSnap.data();
                const userIndex = leagueData.members.findIndex(member => member.userId === user.uid);

                if (userIndex != -1) {
                    const favoritePlayers = leagueData.members[userIndex].favoritePlayers;
                    return {success: true, favoritePlayers };
                }
            }
        }
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that deletes the player with the same name as the one passed as a parameter from the users favorite players list
exports.deleteFavoritePlayer = functions.https.onCall (async (data, context) => {
    try {
        const playerName = data.playerName;
        const user = context.auth;

        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueDocRef = db.collection('Leagues').doc(userData.league);
            const leagueDocSnap = await leagueDocRef.get();

            if (leagueDocSnap.exists) {
                const leagueData = leagueDocSnap.data();

                const userIndex = leagueData.members.findIndex(member => member.userId === user.uid);

                if (userIndex != -1) {
                    const favoritePlayers = leagueData.members[userIndex].favoritePlayers || [];
                    const index = favoritePlayers.findIndex(player => player.name === playerName);
                    if (index!== -1) {
                        favoritePlayers.splice(index, 1);
                        leagueData.members[userIndex].favoritePlayers = favoritePlayers;

                        await leagueDocRef.update({ members: leagueData.members });

                        return {success: true}
                    }
                }
            }
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that updates the user multiplier
exports.changeUserMultiplier = functions.https.onCall (async (data, context) => {
    try {
        const multiplier = data.multiplier;
        const user = context.auth;

        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);

        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueDocRef = db.collection('Leagues').doc(userData.league);
            const leagueDocSnap = await leagueDocRef.get();

            if (leagueDocSnap.exists) {
                const leagueData = leagueDocSnap.data();

                const userIndex = leagueData.members.findIndex(member => member.userId === user.uid);

                if (userIndex != -1) {  
                    leagueData.members[userIndex].multiplier = multiplier;
                    await leagueDocRef.update({ members: leagueData.members });

                    return {success: true}     
                }
            }
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that returns the infor of a user
exports.getUserInfo = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            var userInfo = userData;
            const leagueDocRef = db.collection('Leagues').doc(userData.league);
            const leagueDocSnap = await leagueDocRef.get();

            if (leagueDocSnap.exists) {
                const leagueData = leagueDocSnap.data();
                userInfo.league = leagueData.name;

                return {success: true, userInfo };
            }
        }
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

//Function that deletes a user from the members of a league
exports.leaveLeague = functions.https.onCall (async (data, context) => {
    try {
        const user = context.auth;
        const db = admin.firestore();
        const userDocRef = db.collection('Users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            const leagueId = userData.league;
            const leagueDocRef = db.collection('Leagues').doc(leagueId);
            const leagueDocSnap = await leagueDocRef.get();

            if (leagueDocSnap.exists) {
                const leagueData = leagueDocSnap.data();
                const members = leagueData.members;

                if (members.length === 1) {
                    const batch = db.batch();
                    batch.delete(leagueDocRef);
                    batch.delete(db.collection('MarketPlayers').doc(leagueId));
                    batch.delete(db.collection('FreePlayers').doc(leagueId));
                    batch.delete(db.collection('PlayerBids').doc(leagueId));
                    batch.update(userDocRef, { league: admin.firestore.FieldValue.delete() });

                    await batch.commit();
                } else {
                    const freePlayersRef = db.collection('FreePlayers').doc(userData.league);
                    const freePlayersSnap = await freePlayersRef.get();
                    if (freePlayersSnap.exists) {
                        const freePlayersData = freePlayersSnap.data();
                        const member = members.find(member => member.userId === user.uid);
                        const updatedMembers = members.filter(member => member.userId !== user.uid);
                        const players = member.team;
    
                        for (const player of players) {
                            freePlayersData.players.push(player);
                        }

                        const batch = db.batch();
                        batch.update(userDocRef, { league: admin.firestore.FieldValue.delete() });
                        batch.update(leagueDocRef, { members: updatedMembers });
                        batch.update(freePlayersRef, { players: freePlayersData.players });

                        await batch.commit();

                        return { success: true };
                    }
                }
            }
        }
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});

