import React, {useState, useRef, useEffect} from 'react'
import {useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Image, ScrollView, Alert } from 'react-native';


function Player() {

  //Navigation
  const navigation = useNavigation();
  const route = useRoute();
  const { player } = route.params;

  //Variables
  const [Season2324ButtonPressed, setSeason2324ButtonPressed] = useState(true);
  const [Season2223ButtonPressed, setSeason2223ButtonPressed] = useState(false);
  const [Season2122ButtonPressed, setSeason2122ButtonPressed] = useState(false);
  const [Season2021ButtonPressed, setSeason2021ButtonPressed] = useState(false);
  /* const player = {
    name: 'Ter Stegen', position: 'POR', points: 71, price: 12000000, team: 'Barça', 
    seasons: {"2324": {points: 71, againstGoals: 15, zeroGoals: 8, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 17},
    "2223": {points: 216, againstGoals: 39, zeroGoals: 28, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 50},
    "2122": {points: 137, againstGoals: 57, zeroGoals: 15, goals: 0, asists: 0, yellowCards: 3, redCards: 0, matches: 49},
    "2021": {points: 131, againstGoals: 50, zeroGoals: 14 ,goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 42}}
  }; */
  const [SeasonInfo, setSesonInfo] = useState(player.seasons["2324"]);
  const ImageUrl = player.team === "Madrid" ? require("../../assets/Madrid.png") :
                    player.team === "Atlético de Madrid" ? require("../../assets/Atletico_de_Madrid.png") :
                    require("../../assets/Barça.png");
  //Functions
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

  const handleSeason = (season) => {
    if (season === '23/24') {
      setSeason2324ButtonPressed(true);
      setSeason2223ButtonPressed(false);
      setSeason2122ButtonPressed(false);
      setSeason2021ButtonPressed(false);
      setSesonInfo(player.seasons["2324"]);
    } else if (season === '22/23')  {
      setSeason2324ButtonPressed(false);
      setSeason2223ButtonPressed(true);
      setSeason2122ButtonPressed(false);
      setSeason2021ButtonPressed(false);
      setSesonInfo(player.seasons["2223"]);
    } else if (season === '21/22') {
      setSeason2324ButtonPressed(false);
      setSeason2223ButtonPressed(false);
      setSeason2122ButtonPressed(true);
      setSeason2021ButtonPressed(false);
      setSesonInfo(player.seasons["2122"]);
    } else {
      setSeason2324ButtonPressed(false);
      setSeason2223ButtonPressed(false);
      setSeason2122ButtonPressed(false);
      setSeason2021ButtonPressed(true);
      setSesonInfo(player.seasons["2021"]);
    }
  }

  return (
    <View style = {styles.MainContainer}>
        <View style = {styles.MainInfoContainer}>
          <View style = {styles.PlayerTeamPositionContainer}>
            <Image
              source={ImageUrl}
              style={styles.Image}
            />
            <View style = {[styles.PlayePositionContainer, {backgroundColor: getPositionColor(player.position)}]}>
              <Text style = {styles.PlayerPosition}>{player.position}</Text>
            </View>
          </View>
          <View style = {styles.PlayerNameContainer}>
            <Ionicons name="person-circle-sharp" size={40} color="black" />
            <Text style = {styles.PlayerName}>{player.name}</Text>
          </View>
        </View>
        <View style = {styles.PointsPriceContainer}>
          <View style = {styles.PlayerPointsContainer}>
            <Text style = {styles.PlayerPointsTitle}>Puntos:</Text>
            <Text style = {styles.PlayerPoints}>{player.points}</Text>
          </View>
          <View style = {styles.PlayerPriceContainer}>
            <Text style = {styles.PlayerPriceTitle}>Precio:</Text>
            <Text style = {styles.PlayerPrice}>{player.price}</Text>
          </View>
        </View>
        <View style = {styles.DetailedInfoContainer}>
          <Text style = {styles.DetailedInfoTitle}>Información detallada</Text>
          <View style = {styles.SeasonsButtonsContainer}>
            <TouchableOpacity onPress={() => handleSeason('23/24')}
            style = {[styles.Season2324Button, { backgroundColor: Season2324ButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
              <Text style = {styles.SeasonText}>Season 23/24</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSeason('22/23')}
            style = {[styles.Season2223Button, { backgroundColor: Season2223ButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
              <Text style = {styles.SeasonText}>Season 22/23</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSeason('21/22')}
            style = {[styles.Season2122Button, { backgroundColor: Season2122ButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
              <Text style = {styles.SeasonText}>Season 21/22</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSeason('20/21')}
            style = {[styles.Season2021Button, { backgroundColor: Season2021ButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
              <Text style = {styles.SeasonText}>Season 20/21</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.SeasonInfoContainer}>
            <View style = {styles.StatsContainer}>
              <Text style = {styles.SeasonInfoText}>Puntos:</Text>
              <Text style = {styles.Stats}>{SeasonInfo.points}</Text>
            </View>
            {player.position === 'POR' && (
            <View>
              <View style = {styles.StatsContainer}>
                <Text style = {styles.SeasonInfoText}>Goles recibidos:</Text>
                <Text style = {styles.Stats}>{SeasonInfo.againstGoals}</Text>
              </View>
              <View style = {styles.StatsContainer}>
                <Text style = {styles.SeasonInfoText}>Porterias a zero:</Text>
                <Text style = {styles.Stats}>{SeasonInfo.zeroGoals}</Text>
              </View>
            </View>
            )}
            <View style = {styles.StatsContainer}>
              <Text style = {styles.SeasonInfoText}>Goles:</Text>
              <Text style = {styles.Stats}>{SeasonInfo.goals}</Text>
            </View>
            <View style = {styles.StatsContainer}>
              <Text style = {styles.SeasonInfoText}>Asistencias:</Text>
              <Text style = {styles.Stats}>{SeasonInfo.asists}</Text>
            </View>
            <View style = {styles.StatsContainer}>
              <Text style = {styles.SeasonInfoText}>Tarjetas amarillas:</Text>
              <Text style = {styles.Stats}>{SeasonInfo.yellowCards}</Text>
            </View>
            <View style = {styles.StatsContainer}>
              <Text style = {styles.SeasonInfoText}>Tarjetas rojas:</Text>
              <Text style = {styles.Stats}>{SeasonInfo.redCards}</Text>
            </View>
            <View style = {styles.StatsContainer}>
              <Text style = {styles.SeasonInfoText}>Partidos:</Text>
              <Text style = {styles.Stats}>{SeasonInfo.matches}</Text>
            </View>
            <FontAwesome5 
              name="trophy" 
              size={100} 
              color="#EBCC05"
              style = {styles.TrophyIcon}
            />
          </View>
          <View style = {styles.BackButtonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}
            style = {styles.BackButton}>
              <Text style = {styles.BackText}>Atras</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  MainInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 100,
    marginTop: 30,
    borderBottomWidth: 1,
    elevation: 20,
    backgroundColor: '#D1D1D1'
  },
  PointsPriceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    elevation: 20,
    backgroundColor: '#DCDCDC'
  },
  PlayePositionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 50,
    heigh: 30,
    borderWidth: 1,
    borderRadius: 5
  },
  PlayerTeamPositionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    height: 50,
    right: 70,
  },
  PlayerNameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 70
  },
  PlayerPointsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    flexDirection: 'row'
  },
  PlayerPriceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    flexDirection: 'row'
  },
  DetailedInfoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  SeasonsButtonsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 10
  },
  SeasonInfoContainer: {
    width: '95%',
    height: 300,
    marginTop: 20,
    backgroundColor: '#DCDCDC',
    borderRadius: 20,
    borderWidth: 1,
    elevation: 20
  },
  StatsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 150,
  },
  BackButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  //Text
  PlayerPosition: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  PlayerTeam: {
    fontWeight: 'bold',
    width: 80,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 5
  },
  PlayerName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  PlayerPoints: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  PlayerPrice: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  DetailedInfoTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    left: 10,
    marginTop: 15,
    marginBottom: 5
  },
  SeasonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15
  },
  SeasonInfoText: {
    fontWeight: 'bold',
    fontSize: 17,
    left: 20,
    top: 30,
    marginBottom: 5,
    color: 'rgba(0, 0, 0, 0.5)'
  },
  Stats: {
    fontWeight: 'bold',
    fontSize: 17,
    left: 40,
    top: 30,
    marginBottom: 5
  },
  PlayerPointsTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    right: 10,
    color: 'rgba(0, 0, 0, 0.5)'
  },
  PlayerPriceTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    right: 10,
    color: 'rgba(0, 0, 0, 0.5)'
  },
  BackText: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  //Buttons
  Season2324Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 50,
    width: 75,
    marginLeft: 5,
    marginRight: 5,
    elevation: 20
  },
  Season2223Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 50,
    width: 75,
    marginLeft: 5,
    marginRight: 5,
    elevation: 20
  },
  Season2122Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 50,
    width: 75,
    marginLeft: 5,
    marginRight: 5,
    elevation: 20
  },
  Season2021Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 50,
    width: 75,
    marginLeft: 5,
    marginRight: 5,
    elevation: 20
  },
  BackButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 50,
    width: 150,
    marginTop: 110,
    backgroundColor: '#1D8700'
  },

  //Icons
  TrophyIcon: {
    bottom: 140,
    left: 220,
    transform: [{ rotate: '-15deg' }]
  },

  //Images
  Image: {
    width: 35,
    height: 35,
    zIndex: -2,
    marginBottom: 5
  },
});

export default Player;