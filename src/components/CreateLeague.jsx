import React, {useState, useEffect } from 'react'
import {useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Alert } from 'react-native';
import { createLeague, searchLeague, searchAllLeagues, joinLeague } from './FirebaseFunctions';

function CreateLeague() {

  //Navigation
  const navigation = useNavigation();

  //Variables
  const [leagueName, setLeagueName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [SearchButtonPressed, setSearchButtonPressed] = useState(false);
  const [CreateButtonPressed, setCreateButtonPressed] = useState(false);
  const [leagues, setLeagues] = useState([]);

  //Functions
  useEffect(() => {
    handleSearchAllLeagues();
  }, []);

  const hadleOpenCreateLeagueModal = () => {
    setCreateButtonPressed(true);
    handleSearchAllLeagues();
  }

  const handleOpenSearchLeagueModal = () => {
    setSearchButtonPressed(true);
  };

  const handleCloseSearchModal = () => {
    setSearchButtonPressed(false);
    setSearchResults(leagues);
  }

  const handleCreateLeague = () => {
    createLeague(leagueName)
    .then(response => {
      console.log(response);
      if (response.success === true) {
          setTimeout(() => {
              navigation.navigate('BottomTab');
          }, 5000);
      } else {
          Alert.alert(response.error);
      }
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  };

  const handleSearchAllLeagues = () => {
    searchAllLeagues()
    .then((data) => {
      setLeagues(data);
      setSearchResults(data);
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  };

  const handleSearchLeague = (text) => {
    setSearchText(text); 
 
    if (text.length > 0) {
      searchLeague(text)
        .then((data) => {
          setSearchResults(data); 
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    } else {
      setSearchResults(leagues);
    }
  };

  const handleJoinLeague = (leagueName) => {
    joinLeague(leagueName)
    .then(() => {
      navigation.navigate('BottomTab');
    })
    .catch((error) => {
      Alert.alert(error.message);
    });
  }

  const renderItem =({item}) => {
    return (
      <View style={styles.LeaguesWrapper}>
          <Text style = {styles.LeagueName}>{item.name}</Text>
          <TouchableOpacity onPress={() => handleJoinLeague(item.name)}
          style={styles.JoinButton}>
            <Text>Unirse</Text>
          </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style = {styles.MainContainer}>
      <Ionicons 
        name="football" 
        size={100} 
        color="black"
        style = {styles.FootballIcon}
      />

      <Text style = {styles.MainTitle}>Fantasy App</Text>

      <View style = {styles.MainTextContainer}>
        <Text style = {styles.MainText}>Crea o únete a una liga para jugar con tus amigos</Text>
      </View>

      <View style = {styles.SearchButtonContainer}>
          <TouchableOpacity 
            style = {styles.CreateButton}
            onPress={hadleOpenCreateLeagueModal}>
              <Text style = {styles.SearchText}>Crear Liga</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style = {styles.SearchButton}
            onPress={handleOpenSearchLeagueModal}>
              <Text style = {styles.SearchText}>Buscar Liga</Text>
          </TouchableOpacity>
      </View>

      <View>
        <MaterialCommunityIcons 
          name="soccer-field" 
          size={170} 
          color="#1D8501"
          style = {styles.FieldIcon} 
        />
        <FontAwesome5 
          name="trophy" 
          size={150} 
          color="#EBCC05"
          style = {styles.TrophyIcon}
        />
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={CreateButtonPressed}>
        <View style={styles.ModalBackground}>
          <View style = {styles.ModalContainer}>
            <View style={styles.CloseContainer}>
              <TouchableOpacity onPress={() => setCreateButtonPressed(false)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style = {styles.CreateInputContainer}>
              <TextInput
                style = {styles.CreateInput}
                onChangeText={setLeagueName}
                placeholder={'Nombre de la liga'}>
              </TextInput>
              <TouchableOpacity onPress={handleCreateLeague}
                style = {styles.CreateLeagueButton}>
                <Text style = {styles.SearchText}>Crear Liga</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={SearchButtonPressed}>
        <View style={styles.ModalBackground}>
          <View style = {styles.ModalContainer}>
            <View style={styles.CloseContainer}>
              <TouchableOpacity onPress={handleCloseSearchModal}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style = {styles.SearchInputContainer}>
              <TextInput
                style = {styles.SearchInput}
                onChangeText={handleSearchLeague}
                placeholder={'Nombre de la liga'}>
              </TextInput>
              <TouchableOpacity
                style = {styles.SearchLeagueButton}>
                <FontAwesome6 
                name="magnifying-glass" 
                size={24} 
                color="black" />
              </TouchableOpacity>
            </View>
            <View style = {styles.LeaguesContainer}>
              <FlatList
              data={searchResults}
              renderItem={renderItem}/>
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
    backgroundColor: 'white',
    alignItems: 'center',
  },
  SearchButtonContainer: {
    height: '20%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  MainTitle: {
    marginBottom: 60,
    color: '#2DBC07',
    fontSize: 55,
    fontWeight: 'bold',
  },
  MainTextContainer: {
    width: '85%',
  },
  MainText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  CreateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 50,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: '#2DBC07',
    elevation: 30,
    shadowColor: 'black',
  },
  SearchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: '#145603',
    elevation: 30,
    shadowColor: 'black',
  },
  SearchText: {
    fontWeight: 'bold',
    fontSize: 17
  },
  FootballIcon: {
    zIndex: -2,
    top: 90,
    left: 130
  },
  FieldIcon: {
    zIndex: -2,
    top: 130,
    right: 100,
    transform: [{ rotate: '100deg' }]
  },
  TrophyIcon: {
    bottom: 140,
    left: 100,
    transform: [{ rotate: '-15deg' }]
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

  //Create League Modal
  CreateInputContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '90%',
    marginTop: 100
  },
  CreateInput: {
    width: '90%',
    height: 40,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 7,
    paddingRight: 7,
    textAlign: 'center',
  },
  CreateLeagueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 40,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: '#2DBC07',
    elevation: 30,
    shadowColor: 'black',
  },

  //Search League Modal
  SearchInputContainer: {
    backgroundColor: 'white',
    width: '90%',
    marginTop: 30,
    flexDirection: 'row'
  },
  SearchInput: {
    width: '80%',
    height: 40,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 7,
    paddingRight: 7,
    textAlign: 'center',
    marginRight: 5
  },
  SearchLeagueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: 'green',
    elevation: 30,
    shadowColor: 'black',
  },
  LeaguesContainer: {
    backgroundColor: '#DCDCDC',
    width: '90%',
    height: '75%',
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  LeaguesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
  }, 
  JoinButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: '#2DBC07',
    elevation: 30,
    shadowColor: 'black',
    marginLeft: 10,
  },
  LeagueName: {
    fontWeight: 'bold',
    width: 120,
  }

});

export default CreateLeague;