import React, {useState, useRef} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, ScrollView } from 'react-native';

function Market() {

  //Navigation
  const navigation = useNavigation();

  //Variables
  const scrollViewRef = useRef(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [BuyButtonPressed, setBuyButtonPressed] = useState(false);
  const players = [
    { name: 'Jugador 1', position: 'DC', price: 1000000 },
    { name: 'Jugador 2', position: 'DFC', price: 800000 },
    { name: 'Jugador 3', position: 'MC', price: 1200000 },
    { name: 'Jugador 4', position: 'POR', price: 600000 },
    { name: 'Jugador 5', position: 'DC', price: 1500000 },
    { name: 'Jugador 6', position: 'DFC', price: 700000 },
    { name: 'Jugador 7', position: 'MC', price: 1100000 },
    { name: 'Jugador 8', position: 'MC', price: 650000 },
    { name: 'Jugador 9', position: 'DFC', price: 1300000 },
    { name: 'Jugador 10', position: 'DC', price: 750000 }
  ];

  //Functions
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }, [])
  );
  
  const handleBuyPlayer = (player) => {
    setSelectedPlayer(player);
    setBuyButtonPressed(true);
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

  return (
    <View style = {styles.MainContainer}>
      <View style = {styles.HeaderContainer}>
        <Text style = {styles.PrincipalTitle}>Mercado</Text>
        <FontAwesome6 
          name="money-bills" 
          size={50} 
          color="#26A500"
          style = {styles.MoneyIcon}
        />
      </View>
      <ScrollView ref={scrollViewRef} style = {styles.ScrollView}>
        {players.map((player, index) => {
          return (
            <View style = {styles.PlayerContainer} key={index}>
            <View style = {styles.PlayerTeamPositionContainer}>
              <Text>Barça</Text>
              <View style = {[styles.PlayePositionContainer, {backgroundColor: getPositionColor(player.position)}]}>
                <Text style = {styles.PlayerPosition}>{player.position}</Text>
              </View>
            </View>
            <View style = {styles.PlayerNamePointsContainer}>
              <Text style = {styles.PlayerName}>{player.name}</Text>
              <Text style = {styles.PlayerPoints}>105</Text>
            </View>
            <TouchableOpacity 
              style = {styles.BuyButton}
              onPress={() => handleBuyPlayer(player)}>
                <Text style = {styles.PlayerPrice}>{player.price}</Text>
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
            <Text style = {styles.ModalText}>¿Que precio quieres pujar?</Text>
            <View style = {styles.PriceCointainer}>
              <TextInput
                style = {styles.PriceInput}
                keyboardType='numeric'
                placeholder={selectedPlayer ? selectedPlayer.price.toString() : ''}>
              </TextInput>
              <TouchableOpacity style = {styles.ModalBuyButton}>
                <Text style = {styles.ModalBuyButtonText}>Pujar</Text>
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
    top: 70,
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
  }
    
});

export default Market;