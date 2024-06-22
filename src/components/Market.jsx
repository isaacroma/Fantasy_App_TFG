import React, {useState, useRef, useEffect} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, ScrollView, Alert } from 'react-native';
import { getMarketPlayers, placeBid, updateMarketPlayers, getPlayerBids, deletePlayerBid } from './FirebaseFunctions';

function Market() {

  //Variables
  const {t} = useTranslation();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [actualBid, setActualBid] = useState(null);
  const [bids, setBids] = useState([]);
  const [BuyButtonPressed, setBuyButtonPressed] = useState(false);
  const [SellButtonPressed, setSellButtonPressed] = useState(false);
  const [players, setPlayers] = useState([]);

  //Functions
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
      handlegetMarketPlayers();
      handlegetPlayerBids();
    }, [])
  );

  useEffect(() => {
    handlegetMarketPlayers();
    handlegetPlayerBids();
  }, [])

  const handlegetMarketPlayers = async () => {
      getMarketPlayers()
      .then((data) => {
        setPlayers(data);
        handlegetPlayerBids();
      })
      .catch(error => {
          Alert.alert(error.message);
      });
  };

  const handlegetPlayerBids = async () => {
    getPlayerBids()
    .then((data) => {
      setBids(data);
    })
    .catch(error => {
        Alert.alert(error.message);
    });
};

  const handleUpdateMarket = async () => {
    updateMarketPlayers()
    .then((data) => {
      handlegetMarketPlayers();
    })
    .catch(error => {
        Alert.alert(error.message);
    });
  };

  const handlePlaceBid = async (playerName, bid) => {
    const date = new Date();
    if (bid === null || parseInt(bid, 10) < selectedPlayer.price) {
      Alert.alert(t("No puedes pujar menos de lo que vale el jugador"));
      setActualBid(null);
    } else if (isNaN(parseInt(bid, 10))) {
      Alert.alert(t("Debes realizar una puja valida"));
      setActualBid(null);
    } else {
      placeBid(playerName, parseInt(bid, 10), date)
      .then((data) => {
        setBuyButtonPressed(false);
        setActualBid(null);
        handlegetPlayerBids();
        Alert.alert(t("Puja realizada"));
      })
      .catch(error => {
        Alert.alert(error.message);
      });
    }
  }

  const handleDeleteBid = async (playerName) => {
    deletePlayerBid(playerName)
    .then((data) => {
      setSellButtonPressed(false);
      handlegetPlayerBids();
      Alert.alert(t("Puja retirada"));
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  }
  
  const handleBuyPlayer = (player, hasBid) => {
    setSelectedPlayer(player);
    if (hasBid) {
      setSellButtonPressed(true);
    } else {
      setBuyButtonPressed(true);
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

  const getPriceAndBidStatus = (player) => {
    const bid = bids.find(bid => bid.playerName === player.name);
    return bid? { price: bid.price, hasBid: true } : { price: player.price, hasBid: false };
  };

  return (
    <View style = {styles.MainContainer}>
      <View style = {styles.HeaderContainer}>
        <Text style = {styles.PrincipalTitle}>{t('Mercado')}</Text>
        <FontAwesome6 
          name="money-bills" 
          size={50} 
          color="#26A500"
          style = {styles.MoneyIcon}
        />
      </View>
      <TouchableOpacity onPress={() => handleUpdateMarket()}>
        <Text>{t('Actualizar Mercado')}</Text>
      </TouchableOpacity>
      <ScrollView ref={scrollViewRef} style = {styles.ScrollView}>
        {players.map((player, index) => {
          const { price, hasBid } = getPriceAndBidStatus(player);
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
            <TouchableOpacity 
              style = {[styles.BuyButton, hasBid && {backgroundColor: '#FF3838'}]}
              onPress={() => handleBuyPlayer(player, hasBid)}>
                <Text style = {styles.PlayerPrice}>{price}</Text>
            </TouchableOpacity>
          </View>
          );
        })}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={BuyButtonPressed}>
        <View style={styles.ModalBackground}>
          <View style = {styles.ModalContainer}>
            <View style={styles.CloseContainer}>
              <TouchableOpacity onPress={() => setBuyButtonPressed(false)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text style = {styles.ModalText}>{t('¿Que precio quieres pujar?')}</Text>
            <View style = {styles.PriceCointainer}>
              <TextInput
                style = {styles.PriceInput}
                onChangeText={setActualBid}
                keyboardType='numeric'
                placeholder={selectedPlayer ? selectedPlayer.price.toString() : ''}
                value = {actualBid}>
              </TextInput>
              <TouchableOpacity onPress={() => handlePlaceBid(selectedPlayer.name, actualBid)}
              style = {styles.ModalBuyButton}>
                <Text style = {styles.ModalBuyButtonText}>{t('Pujar')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            <Text style = {styles.ModalText}>{t('¿Seguro que quieres retirar la puja?')}</Text>
            <View style = {styles.PriceCointainer}>
              <TouchableOpacity onPress={() => handleDeleteBid(selectedPlayer.name)}
              style = {styles.ModalSellButton}>
                <Text style = {styles.ModalSellButtonText}>{t('Retirar')}</Text>
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
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 2,
    marginBottom: 1,
  },
  ScrollView: {
    backgroundColor: 'white',
    width: '100%'
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

  //Buttons
  BuyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 115,
    height: 40,
    backgroundColor: '#24A000',
    borderRadius: 30,
    borderWidth: 1,
    left: 30,
    elevation: 5
  },

  //Text
  PrincipalTitle: {
    marginTop: '15%',
    marginBottom: 20,
    fontSize: 40,
    fontWeight: 'bold',
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
    fontWeight: 'bold'
  },
  PlayerPosition: {
    fontWeight: 'bold',
  },

  //Icons
  MoneyIcon: {
    transform: [{ rotate: '-15deg' }],
    marginLeft: 30,
    marginTop: 25,
  },

  //Buy Modal
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
  ModalBuyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '50%',
    backgroundColor: '#24A000',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
    elevation: 20
  },
  ModalBuyButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  ModalText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  //Sell Modal
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
});

export default Market;