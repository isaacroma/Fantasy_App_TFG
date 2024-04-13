import React, {useState, useRef, useEffect} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, ScrollView, Alert } from 'react-native';
import { obtainPlayers, searchPlayer, filterPlayersByPosition, filterPlayersByPrice, addFovoritePlayer } from './FirebaseFunctions';

function SearchPlayers() {

  //Navigation
  const navigation = useNavigation();

  //Variables
  const scrollViewRef = useRef(null);
  //const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [FilterButtonPresses, setFilterButtonPressed] = useState(false);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [PORButtonPressed, setPORButtonPressed] = useState(false);
  const [DFCButtonPressed, setDFCButtonPressed] = useState(false);
  const [MCButtonPressed, setMCButtonPressed] = useState(false);
  const [DCButtonPressed, setDCButtonPressed] = useState(false);
  const [Price1ButtonPressed, setPrice1ButtonPressed] = useState(false);
  const [Price2ButtonPressed, setPrice2ButtonPressed] = useState(false);
  const [Price3ButtonPressed, setPrice3ButtonPressed] = useState(false);
  const [Price4ButtonPressed, setPrice4ButtonPressed] = useState(false);

  //Functions
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    handleObtainPlayers();
  }, []);

  const handleObtainPlayers = () => {
    obtainPlayers()
    .then((data) => {
      setAllPlayers(data);
      setPlayers(data);
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  };

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

  const handleSearchPlayer = (text) => {
    setSearchText(text); 
 
    if (text.length > 0) {
      searchPlayer(text)
        .then((data) => {
          setPlayers(data);
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    } else {
      setPlayers(allPlayers);
    }
  };

  const handleFilterPlayersByPosition = (position) => {
    setPrice1ButtonPressed(false);
    setPrice2ButtonPressed(false);
    setPrice3ButtonPressed(false);
    setPrice4ButtonPressed(false);
    if (position == 'POR') {
      setPORButtonPressed(true);
      setDFCButtonPressed(false);
      setMCButtonPressed(false);
      setDCButtonPressed(false);
    } else if (position == 'DFC') {
      setPORButtonPressed(false);
      setDFCButtonPressed(true);
      setMCButtonPressed(false);
      setDCButtonPressed(false);
    } else if (position == 'MC') {
      setPORButtonPressed(false);
      setDFCButtonPressed(false);
      setMCButtonPressed(true);
      setDCButtonPressed(false);
    } else {
      setPORButtonPressed(false);
      setDFCButtonPressed(false);
      setMCButtonPressed(false);
      setDCButtonPressed(true);
    }

    filterPlayersByPosition(position)
    .then((data) => {
      setPlayers(data);
    })
    .catch((error) => {
      Alert.alert(error.message);
    });
  }

  const handleFilterPlayersByPrice = (min, max) => {
    setPORButtonPressed(false);
    setDFCButtonPressed(false);
    setMCButtonPressed(false);
    setDCButtonPressed(false);
    if (min == 0 && max == 1000000) {
      setPrice1ButtonPressed(true);
      setPrice2ButtonPressed(false);
      setPrice3ButtonPressed(false);
      setPrice4ButtonPressed(false);
    } else if (min == 1000000 && max == 5000000) {
      setPrice1ButtonPressed(false);
      setPrice2ButtonPressed(true);
      setPrice3ButtonPressed(false);
      setPrice4ButtonPressed(false);
    } else if (min == 5000000 && max == 10000000) {
      setPrice1ButtonPressed(false);
      setPrice2ButtonPressed(false);
      setPrice3ButtonPressed(true);
      setPrice4ButtonPressed(false);
    } else {
      setPrice1ButtonPressed(false);
      setPrice2ButtonPressed(false);
      setPrice3ButtonPressed(false);
      setPrice4ButtonPressed(true);
    }

    filterPlayersByPrice(min, max)
    .then((data) => {
      setPlayers(data);
    })
    .catch((error) => {
      Alert.alert(error.message);
    });
  }

  const handleAddFavoritePlayer = (playerName, index) => {
    addFovoritePlayer(playerName)
    .then(() => {
      toggleFavorite(index);
    })
    .catch((error) => {
      Alert.alert(error.message);
    });
  }

  const handleDeleteFilters = () => {
    setPORButtonPressed(false);
    setDFCButtonPressed(false);
    setMCButtonPressed(false);
    setDCButtonPressed(false);
    setPrice1ButtonPressed(false);
    setPrice2ButtonPressed(false);
    setPrice3ButtonPressed(false);
    setPrice4ButtonPressed(false);
    setFilterButtonPressed(false);
    setPlayers(allPlayers);
  }

  return (
    <View style = {styles.MainContainer}>
      <View style = {styles.HeaderContainer}>
        <View style = {styles.SearchContainer}>
          <TextInput
            style = {styles.SearchInput}
            onChangeText={handleSearchPlayer}
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
              <Text style = {styles.PlayerPoints}>{player.points}</Text>
            </View>
            <TouchableOpacity 
              style = {styles.FavoriteButton}
              onPress={() => handleAddFavoritePlayer(player.name, index)}>
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
                <TouchableOpacity onPress={() => handleFilterPlayersByPosition('POR')}
                style = {[styles.PORButton, { backgroundColor: PORButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                  <Text style = {styles.Text}>POR</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterPlayersByPosition('DFC')}
                style = {[styles.DFCButton, { backgroundColor: DFCButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                  <Text style = {styles.Text}>DFC</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterPlayersByPosition('MC')}
                style = {[styles.MCButton, { backgroundColor: MCButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                  <Text style = {styles.Text}>MC</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterPlayersByPosition('DC')}
                style = {[styles.DCButton, { backgroundColor: DCButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                  <Text style = {styles.Text}>DC</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style = {styles.PriceFilterContainer}>
              <Text style = {styles.Text}>Precio</Text>
              <View style = {styles.PriceButtonsContainer}>
                <TouchableOpacity onPress={() => handleFilterPlayersByPrice(0, 1000000)}
                style = {[styles.Price1Button, { backgroundColor: Price1ButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                  <Text style = {styles.Text}>0-1M</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterPlayersByPrice(1000000, 5000000)}
                style = {[styles.Price2Button, { backgroundColor: Price2ButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                  <Text style = {styles.Text}>1-5M</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterPlayersByPrice(5000000, 10000000)}
                style = {[styles.Price3Button, { backgroundColor: Price3ButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                  <Text style = {styles.Text}>5-10M</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterPlayersByPrice(10000000, 99999999)}
                style = {[styles.Price4Button, { backgroundColor: Price4ButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                  <Text style = {styles.Text}>+10M</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style = {styles.DeleteFiltersContainer}>
              <TouchableOpacity onPress={handleDeleteFilters}
              style = {styles.DeleteFiltersButton}>
                <Text>Borrar Filtros</Text>
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
  },
  //Delete Filters
  DeleteFiltersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  DeleteFiltersButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DD1919',
    height: '30%',
    width: 100,
    borderRadius: 20,
    borderWidth: 1
  }
});

export default SearchPlayers;