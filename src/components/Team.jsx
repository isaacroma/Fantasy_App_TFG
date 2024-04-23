import React, {useState, useRef, useEffect} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Image, ScrollView } from 'react-native';
import { getUserTeam } from './FirebaseFunctions';

function Team() {

  //Navigation
  const navigation = useNavigation();

  //Variables
  const scrollViewRef = useRef(null);
  const [players, setPlayers] = useState([]);
  const [money, setMoney] = useState(null);

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
              <Text>{player.team}</Text>
              <View style = {[styles.PlayePositionContainer, {backgroundColor: getPositionColor(player.position)}]}>
                <Text style = {styles.PlayerPosition}>{player.position}</Text>
              </View>
            </View>
            <View style = {styles.PlayerNamePointsContainer}>
              <Text style = {styles.PlayerName}>{player.name}</Text>
              <Text style = {styles.PlayerPoints}>{player.points}</Text>
            </View>
            <TouchableOpacity 
              style = {styles.SellButton}>
                <Text style = {styles.PlayerPrice}>Vender</Text>
            </TouchableOpacity>
          </View>
          );
        })}
        </View>
      </ScrollView>
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
    backgroundColor: '#A9A9A9',
    borderRadius: 30,
    borderWidth: 1,
    left: 30,
    elevation: 5
  },
});

export default Team;