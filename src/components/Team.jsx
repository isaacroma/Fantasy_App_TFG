import React, {useState, useRef, useEffect} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Image, ScrollView, Alert } from 'react-native';
import { getUserTeam, sellPlayer } from './FirebaseFunctions';

function Team() {

  //Navigation
  const navigation = useNavigation();

  //Variables
  const scrollViewRef = useRef(null);
  const [players, setPlayers] = useState([]);
  const [money, setMoney] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [SellButtonPressed, setSellButtonPressed] = useState(false);

  //Functions
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    handlegetUserInfo();
  }, [])

  const handlegetUserInfo = async () => {
      getUserTeam()
      .then((data) => {
          setPlayers(data.team);
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
      Alert.alert("Jugador vendido!");
    })
    .catch(error => {
        Alert.alert(error.message);
    });
  };

  const handleOpenSellModal = (player) => {
    setSelectedPlayer(player);
    setSellButtonPressed(true);
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

  /* const getAlignedColor = (aligned) => {
    switch(aligned) {
      case true:
        return '#64EE51';
      case false:
        return '#EE5151';
      default:
        return 'white';
    }
  } */

  return (
    <View style = {styles.MainContainer}>
      <View style = {styles.HeaderContainer}>
        <Text style = {styles.PrincipalTitle}>Equipo</Text>
        <View style = {styles.MoneyContainer}>
          <Text style = {styles.Text}>{money}</Text>
        </View>
      </View>
      <ScrollView ref={scrollViewRef} style = {styles.ScrollView}>
        <View style = {styles.ImageContainer}>
          <Image
            source={require("../../assets/Campo_de_futbol.png")}
            style={styles.Image}
          />
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
                <Text style = {styles.PlayerPrice}>Vender</Text>
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
            <Text style = {styles.ModalText}>¿Seguro que quieres vender este jugador?</Text>
            <Text style = {styles.PriceText}>Precio: {selectedPlayer.price}</Text>
            <View style = {styles.PriceCointainer}>
              <TouchableOpacity onPress={() => handleSellPlayer(selectedPlayer.name, selectedPlayer.price)}
              style = {styles.ModalSellButton}>
                <Text style = {styles.ModalSellButtonText}>Vender</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: 'green',
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
    zIndex: -2
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

  //Modal
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
});

export default Team;