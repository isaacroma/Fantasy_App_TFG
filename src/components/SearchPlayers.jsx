import React, {useState, useRef} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, ScrollView } from 'react-native';

function SearchPlayers() {

  //Navigation
  const navigation = useNavigation();

  //Variables
  const scrollViewRef = useRef(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [FilterButtonPresses, setFilterButtonPressed] = useState(false);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
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
    { name: 'Jugador 10', position: 'DC', price: 750000 },
    { name: 'Jugador 11', position: 'DC', price: 1000000 },
    { name: 'Jugador 12', position: 'DFC', price: 800000 },
    { name: 'Jugador 13', position: 'MC', price: 1200000 },
    { name: 'Jugador 14', position: 'POR', price: 600000 },
    { name: 'Jugador 15', position: 'DC', price: 1500000 },
    { name: 'Jugador 16', position: 'DFC', price: 700000 },
    { name: 'Jugador 17', position: 'MC', price: 1100000 },
    { name: 'Jugador 18', position: 'MC', price: 650000 },
    { name: 'Jugador 19', position: 'DFC', price: 1300000 },
    { name: 'Jugador 20', position: 'DC', price: 750000 }
  ];

  //Functions
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }, [])
  );
  const handleFilters = () => {
    setFilterButtonPressed(true);
  }
  const toggleFavorite = (index) => {
    const updatedFavorites = [...favoritePlayers];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavoritePlayers(updatedFavorites);
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
        <View style = {styles.SearchContainer}>
          <TextInput
            style = {styles.SearchInput}
            placeholder={'Buscar jugador'}>
          </TextInput>
          <TouchableOpacity style = {styles.SearchButton}>
            <FontAwesome6 
            name="magnifying-glass" 
            size={24} 
            color="white"/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
        style = {styles.FilterButton}
        onPress={handleFilters}>
          <Text>Filtros</Text>
        </TouchableOpacity>
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
              style = {styles.FavoriteButton}
              onPress={() => toggleFavorite(index)}>
              <MaterialIcons 
                name={favoritePlayers[index] ? "favorite" : "favorite-outline"}  
                size={24} 
                color="black" 
              />
            </TouchableOpacity>
          </View>
          );
        })}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={FilterButtonPresses}>
        <View style={styles.ModalBackground}>
          <View style = {styles.ModalContainer}>
            <View style={styles.CloseContainer}>
              <TouchableOpacity onPress={() => setFilterButtonPressed(false)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style = {styles.PositionFilterContainer}>
              <Text style = {styles.Text}>Posición</Text>
              <View style = {styles.PositionButtonsContainer}>
                <TouchableOpacity style = {styles.PORButton}>
                  <Text style = {styles.Text}>POR</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.DFCButton}>
                  <Text style = {styles.Text}>DFC</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.MCButton}>
                  <Text style = {styles.Text}>MC</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.DCButton}>
                  <Text style = {styles.Text}>DC</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style = {styles.PriceFilterContainer}>
              <Text style = {styles.Text}>Precio</Text>
              <View style = {styles.PriceButtonsContainer}>
                <TouchableOpacity style = {styles.Price1Button}>
                  <Text style = {styles.Text}>0-1M</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.Price2Button}>
                  <Text style = {styles.Text}>1-5M</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.Price3Button}>
                  <Text style = {styles.Text}>5-10M</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.Price4Button}>
                  <Text style = {styles.Text}>+10M</Text>
                </TouchableOpacity>
              </View>
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
    width: '100%',
    height: '20%',
    borderBottomWidth: 2,
    marginBottom: 1,
    marginTop: 15
  },
  SearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    marginBottom: 5
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
    right: 70
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
  SearchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009218',
    borderRadius: 50,
    borderWidth: 1,
    width: '15%',
    height: 40,
    marginLeft: 5,
    elevation: 10
  },
  FavoriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    backgroundColor: '#FF3838',
    borderRadius: 30,
    borderWidth: 1,
    left: 50,
    elevation: 5
  },
  FilterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CDCDCD',
    width: 150,
    height: '25%',
    borderRadius: 20,
    borderWidth: 1,
    elevation: 10
  },

  //Inputs
  SearchInput: {
    height: '100%',
    width: '80%',
    borderWidth: 2,
    borderRadius: 15,
    paddingLeft: 7,
    paddingRight: 7,
    textAlign: 'center',
    fontSize: 15,
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
  Text: {
    fontWeight: 'bold'
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
  //Position Filter
  PositionFilterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  PositionButtonsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '30%',
  },
  PORButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: '80%',
    width: 50,
    backgroundColor: '#01CF24'
  },
  DFCButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 5,
    height: '80%',
    width: 50,
    backgroundColor: '#CDCDCD'
  },
  MCButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 5,
    height: '80%',
    width: 50,
    backgroundColor: '#CDCDCD'
  },
  DCButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 5,
    height: '80%',
    width: 50,
    backgroundColor: '#CDCDCD'
  },
  //Price Filter
  PriceFilterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  PriceButtonsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '30%',
  },
  Price1Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: '80%',
    width: 50,
    backgroundColor: '#01CF24'
  },
  Price2Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 5,
    height: '80%',
    width: 50,
    backgroundColor: '#CDCDCD'
  },
  Price3Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 5,
    height: '80%',
    width: 50,
    backgroundColor: '#CDCDCD'
  },
  Price4Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 5,
    height: '80%',
    width: 50,
    backgroundColor: '#CDCDCD'
  }
});

export default SearchPlayers;