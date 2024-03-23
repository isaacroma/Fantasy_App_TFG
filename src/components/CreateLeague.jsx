import React, {useState} from 'react'
import {useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';

function CreateLeague() {

  //Navigation
  const navigation = useNavigation();

  //Variables
  const [SearchButtonPressed, setSearchButtonPressed] = useState(false);
  const [CreateButtonPressed, setCreateButtonPressed] = useState(false);
  const [leagues, setLeagues] = useState(['liga1', 'liga2', 'liga3', 'liga1', 'liga2', 'liga3', 'liga1', 'liga2', 'liga3']);

  //Functions
  const handleCreateLeague = () => {
    setCreateButtonPressed(true);
  };

  const renderItem =({item}) => {
    
    return (
        <View style={styles.LeaguesWrapper}>
            <Text style = {styles.LeagueName}>{leagues}</Text>
            <TouchableOpacity style={styles.JoinButton}>
              <Text>Unirse</Text>
            </TouchableOpacity>
        </View>
    )
  }

  const handleSearchLeague = () => {
    setSearchButtonPressed(true);
  };

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
            onPress={handleCreateLeague}>
              <Text style = {styles.SearchText}>Crear Liga</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style = {styles.SearchButton}
            onPress={handleSearchLeague}>
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
                placeholder={'Nombre de la liga'}>
              </TextInput>
              <TouchableOpacity 
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
              <TouchableOpacity onPress={() => setSearchButtonPressed(false)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style = {styles.SearchInputContainer}>
              <TextInput
                style = {styles.SearchInput}
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
              data={leagues}
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

  //Creaqte League Modal
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
    backgroundColor: '#999999',
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