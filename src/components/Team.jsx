import React, {useState, useRef, useEffect} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, ImageBackground, ScrollView, Alert } from 'react-native';
import { getUserTeam, sellPlayer, alignPlayer, getUserLanguage } from './FirebaseFunctions';

function Team() {

  //Variables
  const {t} = useTranslation();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [players, setPlayers] = useState([]);
  const [money, setMoney] = useState(null);
  const [DCPlayers, setDCPlayers] = useState([]);
  const [MCPlayers, setMCPlayers] = useState([]);
  const [DFCPlayers, setDFCPlayers] = useState([]);
  const [PORPlayers, setPORPlayers] = useState([]);
  const [AlignedDCPlayers, setAlignedDCPlayers] = useState([]);
  const [AlignedMCPlayers, setAlignedMCPlayers] = useState([]);
  const [AlignedDFCPlayers, setAlignedDFCPlayers] = useState([]);
  const [AlignedPORPlayers, setAlignedPORPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(1);
  const [SellButtonPressed, setSellButtonPressed] = useState(false);
  const [AlignButtonPressed, setAlignButtonPressed] = useState(false);
  const [selectedPlayerType, setSelectedPlayerType] = useState('POR');
  const [AlignedPlayers, setAlignedPlayers] = useState([]);
  
  //Functions
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    handleSetUserLanguage();
    handlegetUserInfo();
  }, [])

  useEffect(() => {
    setDCPlayers(players.filter((player) => player.position === 'DC'));
    setMCPlayers(players.filter((player) => player.position === 'MC'));
    setDFCPlayers(players.filter((player) => player.position === 'DFC'));
    setPORPlayers(players.filter((player) => player.position === 'POR'));
  }, [players])

  useEffect(() => {
    setAlignedDCPlayers(AlignedPlayers.filter((player) => player.position === 'DC'));
    setAlignedMCPlayers(AlignedPlayers.filter((player) => player.position === 'MC'));
    setAlignedDFCPlayers(AlignedPlayers.filter((player) => player.position === 'DFC'));
    setAlignedPORPlayers(AlignedPlayers.filter((player) => player.position === 'POR'));
  }, [AlignedPlayers])

  const handleSetUserLanguage = async () => {
    getUserLanguage()
    .then((data) => {
      i18next.changeLanguage(data);
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  };

  const handlegetUserInfo = async () => {
      getUserTeam()
      .then((data) => {
          setPlayers(data.team);
          setAlignedPlayers(data.alignedPlayers);
          setMoney(data.money);
      })
      .catch(error => {
          Alert.alert(error.message);
      });
  };

  const handleSellPlayer = async (playerName, price) => {
    sellPlayer(playerName, price)
    .then(() => {
      setSellButtonPressed(false);
      Alert.alert(t("Jugador vendido"));
      handlegetUserInfo();
    })
    .catch(error => {
        Alert.alert(error.message);
    });
  };

  const handleOpenSellModal = (player) => {
    setSelectedPlayer(player);
    setSellButtonPressed(true);
  };

  const handleOpenAlignModal = (position, player) => {
    if (player === null) {
      setSelectedPlayer(1);
    } else {
      setSelectedPlayer(player);
    }
    setAlignButtonPressed(true);
    if(position == 'DC') {
      setSelectedPlayerType('DC');
    } else if (position == 'MC') {
      setSelectedPlayerType('MC');
    } else if (position == 'DFC') {
      setSelectedPlayerType('DFC');
    } else {
      setSelectedPlayerType('POR');
    }
  };

  const handleAlignPlayer = (player) => {
    const element = AlignedPlayers.find(alignedPlayer => alignedPlayer.name === player.name);
    if (element) {
      Alert.alert(t("Este jugador ya esta alineado"));
    } else {
      let actualPlayer = null;
      if (selectedPlayer === 1) {
        actualPlayer = '';
      } else {
        actualPlayer = selectedPlayer;
      }
      alignPlayer(actualPlayer, player)
        .then(() => {
            handlegetUserInfo();
            setAlignButtonPressed(false);
        })
        .catch(error => {
            Alert.alert(error.message);
        });
    }
  };

  const getPositionColor = (position) => {
    switch(position) {
      case 'MC':
        return '#31D700';
      case 'DC':
        return 'red';
      case 'DFC':
        return '#0088D6';
      case 'POR':
        return 'yellow';
      default:
        return 'white';
    }
  }

  const AlignedGoalscorers = Array(3).fill(null).map((_, index) => {
    const player = AlignedDCPlayers[index] || null;
    return (
      <View>
        <TouchableOpacity onPress={() => handleOpenAlignModal('DC', player)} style={styles.TeamPlayerContainer}>
          <Ionicons name="person-circle-sharp" size={45} color="black" />
          {player && player.position === 'DC' && <Text style = {styles.AlignedPlayerName}>{player.name}</Text>}
        </TouchableOpacity>
      </View>
    );
  });

  const AlignedMidfielders = Array(3).fill(null).map((_, index) => {
    const player = AlignedMCPlayers[index] || null;
    return (
      <View>
        <TouchableOpacity onPress={() => handleOpenAlignModal('MC', player)} style={styles.TeamPlayerContainer}>
          <Ionicons name="person-circle-sharp" size={45} color="black" />
          {player && player.position === 'MC' && <Text style = {styles.AlignedPlayerName}>{player.name}</Text>}
        </TouchableOpacity>
      </View>
    );
  });

  const AlignedDefenders = Array(4).fill(null).map((_, index) => {
    const player = AlignedDFCPlayers[index] || null;
    return (
      <View>
        <TouchableOpacity onPress={() => handleOpenAlignModal('DFC', player)} style={styles.TeamPlayerContainer}>
          <Ionicons name="person-circle-sharp" size={45} color="black" />
          {player && player.position === 'DFC' && <Text style = {styles.AlignedPlayerName}>{player.name}</Text>}
        </TouchableOpacity>
      </View>
    );
  });

  const AlignedGoalkeeper = Array(1).fill(null).map((_, index) => {
    const player = AlignedPORPlayers[index] || null;
    return (
      <View>
        <TouchableOpacity onPress={() => handleOpenAlignModal('POR', player)} style={styles.TeamPlayerContainer}>
          <Ionicons name="person-circle-sharp" size={45} color="black" />
          {player && player.position === 'POR' && <Text style = {styles.AlignedPlayerName}>{player.name}</Text>}
        </TouchableOpacity>
      </View>
    );
  });
  return (
    <View style = {styles.MainContainer}>
      <View style = {styles.HeaderContainer}>
        <Text style = {styles.PrincipalTitle}>{t('Equipo')}</Text>
        <View style = {styles.MoneyContainer}>
          <Text style = {styles.Text}>{money}</Text>
        </View>
      </View>
      <ScrollView ref={scrollViewRef} style = {styles.ScrollView}>
        <View style = {styles.ImageContainer}>
        <ImageBackground
        source={require("../../assets/Campo_de_futbol.png")}
        style={styles.Image}
      >
        <View style = {styles.DCContainer}>
          {AlignedGoalscorers}
        </View>
        <View style = {styles.MCContainer}>
          {AlignedMidfielders}
        </View>
        <View style = {styles.DFCContainer}>
          {AlignedDefenders}
        </View>
        <View style = {styles.PORContainer}>
          {AlignedGoalkeeper}
        </View>
      </ImageBackground>
        </View>
        <View style = {styles.PlayersContainer}>
        {players.map((player, index) => {
          return (
            <View style = {styles.PlayerContainer} key={index}>
            <View style = {styles.PlayerTeamPositionContainer}>
              <Text style = {styles.PlayerTeam}>{player.team}</Text>
              <View style = {[styles.PlayePositionContainer, {backgroundColor: getPositionColor(player.position)}]}>
                <Text style = {styles.PlayerPosition}>{player.position}</Text>
              </View>
            </View>
            <View style = {styles.PlayerNamePointsContainer}>
              <Text style = {styles.PlayerName}>{player.name}</Text>
              <Text style = {styles.PlayerPoints}>{player.points}</Text>
            </View>
            <TouchableOpacity onPress={() => handleOpenSellModal(player)}
              style = {styles.SellButton}>
                <Text style = {styles.PlayerPrice}>{t('Vender')}</Text>
            </TouchableOpacity>
          </View>
          );
        })}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={SellButtonPressed}>
        <View style={styles.ModalBackground}>
          <View style = {styles.ModalContainer}>
            <View style={styles.CloseContainer}>
              <TouchableOpacity onPress={() => setSellButtonPressed(false)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text style = {styles.ModalText}>{t('¿Seguro que quieres vender este jugador?')}</Text>
            <Text style = {styles.PriceText}>{t('Precio')} {selectedPlayer.price}</Text>
            <View style = {styles.PriceCointainer}>
              <TouchableOpacity onPress={() => handleSellPlayer(selectedPlayer.name, selectedPlayer.price)}
              style = {styles.ModalSellButton}>
                <Text style = {styles.ModalSellButtonText}>{t('Vender')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={AlignButtonPressed}>
        <View style={styles.ModalBackground}>
          <View style = {styles.AlignModalContainer}>
            <View style={styles.CloseContainer}>
              <TouchableOpacity onPress={() => setAlignButtonPressed(false)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
              <ScrollView style = {styles.ModalScrollview}>
                <View style = {styles.PlayersContainer}>
                {selectedPlayerType === 'DC' && DCPlayers.map((player, index) => {
                  return (
                    <View style = {styles.PlayerContainer} key={index}>
                    <View style = {styles.ModalPlayerTeamPositionContainer}>
                      <Text style = {styles.PlayerTeam}>{player.team}</Text>
                      <View style = {[styles.PlayePositionContainer, {backgroundColor: getPositionColor(player.position)}]}>
                        <Text style = {styles.PlayerPosition}>{player.position}</Text>
                      </View>
                    </View>
                    <View style = {styles.ModalPlayerNamePointsContainer}>
                      <Text style = {styles.PlayerName}>{player.name}</Text>
                      <Text style = {styles.PlayerPoints}>{player.points}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleAlignPlayer(player)}
                      style = {styles.AlignButton}>
                        <Text style = {styles.PlayerPrice}>{t('Alinear')}</Text>
                    </TouchableOpacity>
                  </View>
                  );
                })}
                {selectedPlayerType === 'MC' && MCPlayers.map((player, index) => {
                  return (
                    <View style = {styles.PlayerContainer} key={index}>
                    <View style = {styles.ModalPlayerTeamPositionContainer}>
                      <Text style = {styles.PlayerTeam}>{player.team}</Text>
                      <View style = {[styles.PlayePositionContainer, {backgroundColor: getPositionColor(player.position)}]}>
                        <Text style = {styles.PlayerPosition}>{player.position}</Text>
                      </View>
                    </View>
                    <View style = {styles.ModalPlayerNamePointsContainer}>
                      <Text style = {styles.PlayerName}>{player.name}</Text>
                      <Text style = {styles.PlayerPoints}>{player.points}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleAlignPlayer(player)}
                      style = {styles.AlignButton}>
                        <Text style = {styles.PlayerPrice}>{t('Alinear')}</Text>
                    </TouchableOpacity>
                  </View>
                  );
                })}
                {selectedPlayerType === 'DFC' && DFCPlayers.map((player, index) => {
                  return (
                    <View style = {styles.PlayerContainer} key={index}>
                    <View style = {styles.ModalPlayerTeamPositionContainer}>
                      <Text style = {styles.PlayerTeam}>{player.team}</Text>
                      <View style = {[styles.PlayePositionContainer, {backgroundColor: getPositionColor(player.position)}]}>
                        <Text style = {styles.PlayerPosition}>{player.position}</Text>
                      </View>
                    </View>
                    <View style = {styles.ModalPlayerNamePointsContainer}>
                      <Text style = {styles.PlayerName}>{player.name}</Text>
                      <Text style = {styles.PlayerPoints}>{player.points}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleAlignPlayer(player)}
                      style = {styles.AlignButton}>
                        <Text style = {styles.PlayerPrice}>{t('Alinear')}</Text>
                    </TouchableOpacity>
                  </View>
                  );
                })}
                {selectedPlayerType === 'POR' && PORPlayers.map((player, index) => {
                  return (
                    <View style = {styles.PlayerContainer} key={index}>
                    <View style = {styles.ModalPlayerTeamPositionContainer}>
                      <Text style = {styles.PlayerTeam}>{player.team}</Text>
                      <View style = {[styles.PlayePositionContainer, {backgroundColor: getPositionColor(player.position)}]}>
                        <Text style = {styles.PlayerPosition}>{player.position}</Text>
                      </View>
                    </View>
                    <View style = {styles.ModalPlayerNamePointsContainer}>
                      <Text style = {styles.PlayerName}>{player.name}</Text>
                      <Text style = {styles.PlayerPoints}>{player.points}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleAlignPlayer(player)}
                      style = {styles.AlignButton}>
                        <Text style = {styles.PlayerPrice}>{t('Alinear')}</Text>
                    </TouchableOpacity>
                  </View>
                  );
                })}
                </View>
              </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  HeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCDCDC',
    width: '100%',
    height: '15%',
    marginTop: '7%',
    borderBottomWidth: 2,
    elevation: 20,
    flexDirection: 'row'
  },
  MoneyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2DBC07',
    width: 150,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    left: 35,
    elevation: 20

  },
  ScrollView: {
    backgroundColor: 'white',
    width: '100%'
  },

  //Text
  PrincipalTitle: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  Text: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  //Image
  ImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 550,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    marginBottom: 5
  },
  Image: {
    width: 550,
    height: 550,
  },

  //Players
  PlayersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  PlayerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 75,
    marginBottom: 5,
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: '#DCDCDC',
  },
  PlayerNamePointsContainer: {
    justifyContent: 'center',
    width: '30%',
    height: 50,
  },
  PlayerTeamPositionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    height: 50,
    right: 40
  },
  PlayerTeam: {
    fontWeight: 'bold',
    width: 80,
    textAlign: 'center'
  },
  PlayePositionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 40,
    heigh: 30,
    borderWidth: 1,
    borderRadius: 5
  },
  PlayerName: {
    fontWeight: 'bold',
    fontSize: 15
  },
  PlayerPoints: {
    fontWeight: 'bold',
    fontSize: 15
  },
  PlayerPrice: {
    fontWeight: 'bold',
  },
  PlayerPosition: {
    fontWeight: 'bold',
  },
  SellButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#FF3838',
    borderRadius: 30,
    borderWidth: 1,
    left: 30,
    elevation: 5
  },

  //Sell Modal
  ModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  ModalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 10,
    padding: 10,
    borderWidth: 3,
    borderColor: 'black',
    width: 300,
    height: 400,
    top: 125,
    right: 45
  },
  CloseContainer: {
    alignItems: 'center',
    position: 'absolute',
    width: 25,
    height: 25,
    top: 5,
    right: 10
  },
  PriceCointainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '25%',
    width: '90%',
  },
  PriceInput: {
    height: '50%',
    width: '90%',
    borderWidth: 2,
    borderRadius: 15,
    paddingLeft: 7,
    paddingRight: 7,
    textAlign: 'center',
    fontSize: 30,
  },
  ModalSellButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '50%',
    backgroundColor: '#FF3838',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
    elevation: 20
  },
  ModalSellButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  ModalText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'rgba(0, 0, 0, 0.5)'
  },
  PriceText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  //Team
  DCContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 150,
    flexDirection: 'row',
    left: 200,
    top: 150
  },
  MCContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 150,
    flexDirection: 'row',
    left: 200,
    top: 220
  },
  DFCContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 150,
    flexDirection: 'row',
    left: 200,
    top: 290
  },
  PORContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 150,
    flexDirection: 'row',
    left: 200,
    top: 350
  },
  TeamPlayerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 60,
    marginLeft: 5,
    marginRight: 5,
  },
  AlignedPlayerName: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    flexWrap: 'wrap'
  },

  //Align Modal
  AlignModalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 10,
    padding: 10,
    borderWidth: 3,
    borderColor: 'black',
    width: 350,
    height: 400,
    top: 125,
    right: 20
  },
  ModalScrollview: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: 25
  },
  ModalPlayerTeamPositionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
    height: 50,
    right: 20,
  },
  ModalPlayerNamePointsContainer: {
    justifyContent: 'center',
    width: '30%',
    height: 50,
    left: 10
  },
  AlignButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#2DBC07',
    borderRadius: 30,
    borderWidth: 1,
    left: 20,
    elevation: 5
  },
});

export default Team;