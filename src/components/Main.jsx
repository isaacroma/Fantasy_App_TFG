import React, {useState, useCallback} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { initializeFirebase, getFirebaseAuth, loginUser, getUserLeague, addPlayersToFirestore } from './FirebaseFunctions';


function Main() {

  //Variables
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  /* const players = [
    {name: 'Iñaki Peña', position: 'POR', points: 33, price: 175000, team: 'Barça', 
    seasons: {"2324": {points: 33, againstGoals: 26, zeroGoals: 2, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 14},
    "2223": {points: 1, againstGoals: 7, zeroGoals: 1, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 5},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Ter Stegen', position: 'POR', points: 71, price: 12000000, team: 'Barça', 
    seasons: {"2324": {points: 71, againstGoals: 15, zeroGoals: 8, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 17},
    "2223": {points: 216, againstGoals: 39, zeroGoals: 28, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 50},
    "2122": {points: 137, againstGoals: 57, zeroGoals: 15, goals: 0, asists: 0, yellowCards: 3, redCards: 0, matches: 49},
    "2021": {points: 131, againstGoals: 50, zeroGoals: 14 ,goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 42}},
    },
    {name: 'Alejandro Balde', position: 'DFC', points: 60, price: 9000000, team: 'Barça', 
    seasons: {"2324": {points: 60, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 1, yellowCards: 1, redCards: 0, matches: 28},
    "2223": {points: 160, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 7, yellowCards: 5, redCards: 0, matches: 44},
    "2122": {points: 12, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 1, yellowCards: 4, redCards: 0, matches: 22},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Andreas Christensen', position: 'DFC', points: 44, price: 7000000, team: 'Barça', 
    seasons: {"2324": {points: 44, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 1, yellowCards: 3, redCards: 0, matches: 24},
    "2223": {points: 126, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 1, yellowCards: 3, redCards: 0, matches: 32},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 3, redCards: 0, matches: 34},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 3, redCards: 0, matches: 27}},
    },
    {name: 'Íñigo Martínez', position: 'DFC', points: 36, price: 4500000, team: 'Barça', 
    seasons: {"2324": {points: 36, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 2, redCards: 0, matches: 11},
    "2223": {points: 80, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 3, redCards: 0, matches: 18},
    "2122": {points: 152, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 0, yellowCards: 10, redCards: 1, matches: 34},
    "2021": {points: 110, againstGoals: 0, zeroGoals: 0 ,goals: 2, asists: 2, yellowCards: 11, redCards: 0, matches: 33}},
    },
    {name: 'Joao Cancelo', position: 'DFC', points: 80, price: 14500000, team: 'Barça', 
    seasons: {"2324": {points: 80, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 2, yellowCards: 5, redCards: 0, matches: 22},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 11, yellowCards: 9, redCards: 1, matches: 47},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 10, yellowCards: 10, redCards: 1, matches: 52},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 3, asists: 6, yellowCards: 9, redCards: 1, matches: 43}},
    },
    {name: 'Jules Koundé', position: 'DFC', points: 68, price: 12000000, team: 'Barça', 
    seasons: {"2324": {points: 68, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 3, yellowCards: 1, redCards: 0, matches: 26},
    "2223": {points: 143, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 6, yellowCards: 2, redCards: 0, matches: 40},
    "2122": {points: 162, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 1, yellowCards: 3, redCards: 2, matches: 44},
    "2021": {points: 189, againstGoals: 0, zeroGoals: 0 ,goals: 4, asists: 1, yellowCards: 8, redCards: 0, matches: 49}},
    },
    {name: 'Marcos Alonso', position: 'DFC', points: 11, price: 200000, team: 'Barça', 
    seasons: {"2324": {points: 11, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 7},
    "2223": {points: 80, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 0, yellowCards: 3, redCards: 0, matches: 37},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 5, asists: 6, yellowCards: 9, redCards: 0, matches: 46},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 2, asists: 0, yellowCards: 2, redCards: 0, matches: 17}},
    },
    {name: 'Ronald Araújo', position: 'DFC', points: 80, price: 13000000, team: 'Barça', 
    seasons: {"2324": {points: 80, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 5, redCards: 1, matches: 22},
    "2223": {points: 116, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 2, yellowCards: 8, redCards: 1, matches: 31},
    "2122": {points: 174, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 0, yellowCards: 7, redCards: 0, matches: 43},
    "2021": {points: 123, againstGoals: 0, zeroGoals: 0 ,goals: 2, asists: 1, yellowCards: 3, redCards: 0, matches: 33}},
    },
    {name: 'Sergi Roberto', position: 'DFC', points: 40, price: 3000000, team: 'Barça', 
    seasons: {"2324": {points: 40, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 1, yellowCards: 5, redCards: 0, matches: 14},
    "2223": {points: 90, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 3, yellowCards: 5, redCards: 1, matches: 33},
    "2122": {points: 34, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 1, redCards: 0, matches: 12},
    "2021": {points: 61, againstGoals: 0, zeroGoals: 0 ,goals: 1, asists: 2, yellowCards: 2, redCards: 0, matches: 20}},
    },
    {name: 'Fermin López', position: 'MC', points: 58, price: 6000000, team: 'Barça', 
    seasons: {"2324": {points: 58, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 1, yellowCards: 1, redCards: 1, matches: 23},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Frenkie De Jong', position: 'MC', points: 81, price: 17000000, team: 'Barça', 
    seasons: {"2324": {points: 81, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 8, redCards: 0, matches: 19},
    "2223": {points: 193, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 4, yellowCards: 3, redCards: 0, matches: 43},
    "2122": {points: 144, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 5, yellowCards: 8, redCards: 1, matches: 47},
    "2021": {points: 213, againstGoals: 0, zeroGoals: 0 ,goals: 7, asists: 8, yellowCards: 6, redCards: 0, matches: 51}},
    },
    {name: 'Gavi', position: 'MC', points: 72, price: 7500000, team: 'Barça', 
    seasons: {"2324": {points: 72, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 6, redCards: 1, matches: 15},
    "2223": {points: 178, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 7, yellowCards: 15, redCards: 0, matches: 49},
    "2122": {points: 180, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 6, yellowCards: 15, redCards: 1, matches: 48},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Ilkay Gündogan', position: 'MC', points: 108, price: 20000000, team: 'Barça', 
    seasons: {"2324": {points: 108, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 7, yellowCards: 2, redCards: 0, matches: 31},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 11, asists: 7, yellowCards: 5, redCards: 0, matches: 51},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 10, asists: 6, yellowCards: 2, redCards: 0, matches: 43},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 17, asists: 5, yellowCards: 3, redCards: 0, matches: 46}},
    },
    {name: 'Oriol Romeu', position: 'MC', points: 38, price: 1500000, team: 'Barça', 
    seasons: {"2324": {points: 108, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 1, yellowCards: 3, redCards: 0, matches: 21},
    "2223": {points: 176, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 0, yellowCards: 11, redCards: 1, matches: 36},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 3, yellowCards: 9, redCards: 0, matches: 42},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 1, asists: 1, yellowCards: 7, redCards: 0, matches: 23}},
    },
    {name: 'Pedri', position: 'MC', points: 51, price: 15000000, team: 'Barça', 
    seasons: {"2324": {points: 51, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 2, yellowCards: 2, redCards: 0, matches: 16},
    "2223": {points: 179, againstGoals: 0, zeroGoals: 0, goals: 7, asists: 1, yellowCards: 3, redCards: 0, matches: 35},
    "2122": {points: 95, againstGoals: 0, zeroGoals: 0, goals: 5, asists: 1, yellowCards: 1, redCards: 0, matches: 22},
    "2021": {points: 208, againstGoals: 0, zeroGoals: 0 ,goals: 4, asists: 6, yellowCards: 2, redCards: 0, matches: 52}},
    },
    {name: 'Ferran Torres', position: 'DC', points: 102, price: 10000000, team: 'Barça', 
    seasons: {"2324": {points: 102, againstGoals: 0, zeroGoals: 0, goals: 11, asists: 4, yellowCards: 5, redCards: 0, matches: 30},
    "2223": {points: 101, againstGoals: 0, zeroGoals: 0, goals: 7, asists: 3, yellowCards: 7, redCards: 1, matches: 45},
    "2122": {points: 76, againstGoals: 0, zeroGoals: 0, goals: 10, asists: 7, yellowCards: 2, redCards: 0, matches: 33},
    "2021": {points: 156, againstGoals: 0, zeroGoals: 0 ,goals: 13, asists: 3, yellowCards: 1, redCards: 0, matches: 36}},
    },
    {name: 'Joao Félix', position: 'DC', points: 86, price: 7500000, team: 'Barça', 
    seasons: {"2324": {points: 86, againstGoals: 0, zeroGoals: 0, goals: 7, asists: 5, yellowCards: 5, redCards: 0, matches: 27},
    "2223": {points: 64, againstGoals: 0, zeroGoals: 0, goals: 9, asists: 3, yellowCards: 6, redCards: 1, matches: 40},
    "2122": {points: 142, againstGoals: 0, zeroGoals: 0, goals: 10, asists: 6, yellowCards: 3, redCards: 1, matches: 35},
    "2021": {points: 137, againstGoals: 0, zeroGoals: 0 ,goals: 10, asists: 6, yellowCards: 6, redCards: 0, matches: 40}},
    },
    {name: 'Lamine Yamal', position: 'DC', points: 97, price: 10500000, team: 'Barça', 
    seasons: {"2324": {points: 97, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 5, yellowCards: 4, redCards: 0, matches: 29},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Marc Guiu', position: 'DC', points: 11, price: 200000, team: 'Barça', 
    seasons: {"2324": {points: 11, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 0, yellowCards: 3, redCards: 0, matches: 11},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Raphinha', position: 'DC', points: 65, price: 9500000, team: 'Barça', 
    seasons: {"2324": {points: 65, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 7, yellowCards: 2, redCards: 1, matches: 20},
    "2223": {points: 202, againstGoals: 0, zeroGoals: 0, goals: 10, asists: 12, yellowCards: 10, redCards: 0, matches: 50},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 11, asists: 3, yellowCards: 7, redCards: 0, matches: 36},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 8, asists: 11, yellowCards: 4, redCards: 0, matches: 38}},
    },
    {name: 'Robert Lewandoski', position: 'DC', points: 86, price: 25000000, team: 'Barça', 
    seasons: {"2324": {points: 86, againstGoals: 0, zeroGoals: 0, goals: 13, asists: 5, yellowCards: 3, redCards: 0, matches: 28},
    "2223": {points: 251, againstGoals: 0, zeroGoals: 0, goals: 33, asists: 8, yellowCards: 3, redCards: 1, matches: 46},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 50, asists: 7, yellowCards: 3, redCards: 0, matches: 46},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 48, asists: 9, yellowCards: 4, redCards: 0, matches: 40}},
    },
    {name: 'Vitor Roque', position: 'DC', points: 3, price: 25000000, team: 'Barça', 
    seasons: {"2324": {points: 3, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 4},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 21, asists: 8, yellowCards: 7, redCards: 0, matches: 45},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 14, asists: 5, yellowCards: 11, redCards: 0, matches: 52},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Andriy Lunin', position: 'POR', points: 50, price: 5000000, team: 'Madrid', 
    seasons: {"2324": {points: 50, againstGoals: 12, zeroGoals: 5, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 13},
    "2223": {points: 25, againstGoals: 13, zeroGoals: 4, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 12},
    "2122": {points: 14, againstGoals: 4, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 4},
    "2021": {points: 25, againstGoals: 2, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 1}},
    },
    {name: 'Kepa Arrizabalaga', position: 'POR', points: 49, price: 4000000, team: 'Madrid', 
    seasons: {"2324": {points: 49, againstGoals: 18, zeroGoals: 7, goals: 0, asists: 0, yellowCards: 2, redCards: 0, matches: 18},
    "2223": {points: 0, againstGoals: 45, zeroGoals: 12, goals: 0, asists: 0, yellowCards: 3, redCards: 0, matches: 39},
    "2122": {points: 0, againstGoals: 10, zeroGoals: 8, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 15},
    "2021": {points: 0, againstGoals: 11, zeroGoals: 6 ,goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 14}},
    },
    {name: 'Thibaut Courtois', position: 'POR', points: 0, price: 100000, team: 'Madrid', 
    seasons: {"2324": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2223": {points: 169, againstGoals: 49, zeroGoals: 17, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 49},
    "2122": {points: 199, againstGoals: 46, zeroGoals: 22, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 52},
    "2021": {points: 216, againstGoals: 44, zeroGoals: 21 ,goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 51}},
    },
    {name: 'Antonio Rüdiguer', position: 'DFC', points: 93, price: 14000000, team: 'Madrid', 
    seasons: {"2324": {points: 93, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 8, redCards: 0, matches: 29},
    "2223": {points: 117, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 0, yellowCards: 1, redCards: 0, matches: 53},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 5, asists: 4, yellowCards: 12, redCards: 0, matches: 54},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 1, asists: 1, yellowCards: 1, redCards: 0, matches: 34}},
    },
    {name: 'Dani carvajal', position: 'DFC', points: 113, price: 15000000, team: 'Madrid', 
    seasons: {"2324": {points: 113, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 3, yellowCards: 3, redCards: 0, matches: 23},
    "2223": {points: 81, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 5, yellowCards: 10, redCards: 1, matches: 45},
    "2122": {points: 96, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 4, yellowCards: 4, redCards: 0, matches: 36},
    "2021": {points: 63, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 4, yellowCards: 5, redCards: 0, matches: 15}},
    },
    {name: 'David Alaba', position: 'DFC', points: 46, price: 5000000, team: 'Madrid', 
    seasons: {"2324": {points: 46, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 2, yellowCards: 3, redCards: 0, matches: 17},
    "2223": {points: 101, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 3, yellowCards: 4, redCards: 1, matches: 39},
    "2122": {points: 154, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 4, yellowCards: 4, redCards: 0, matches: 46},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 2, asists: 7, yellowCards: 7, redCards: 0, matches: 45}},
    },
    {name: 'Éder Militao', position: 'DFC', points: 5, price: 100000, team: 'Madrid', 
    seasons: {"2324": {points: 5, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 1},
    "2223": {points: 189, againstGoals: 0, zeroGoals: 0, goals: 7, asists: 1, yellowCards: 9, redCards: 0, matches: 51},
    "2122": {points: 180, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 3, yellowCards: 9, redCards: 1, matches: 50},
    "2021": {points: 72, againstGoals: 0, zeroGoals: 0 ,goals: 2, asists: 1, yellowCards: 4, redCards: 1, matches: 21}},
    },
    {name: 'Ferland Mendy', position: 'DFC', points: 29, price: 2000000, team: 'Madrid', 
    seasons: {"2324": {points: 29, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 3, redCards: 0, matches: 19},
    "2223": {points: 35, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 1, yellowCards: 4, redCards: 0, matches: 28},
    "2122": {points: 102, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 5, yellowCards: 7, redCards: 0, matches: 35},
    "2021": {points: 113, againstGoals: 0, zeroGoals: 0 ,goals: 2, asists: 0, yellowCards: 5, redCards: 0, matches: 38}},
    },
    {name: 'Fran García', position: 'DFC', points: 52, price: 3000000, team: 'Madrid', 
    seasons: {"2324": {points: 52, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 5, yellowCards: 1, redCards: 0, matches: 22},
    "2223": {points: 178, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 3, yellowCards: 1, redCards: 0, matches: 40},
    "2122": {points: 148, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 1, yellowCards: 4, redCards: 0, matches: 39},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Lucas Vázquez', position: 'DFC', points: 43, price: 2500000, team: 'Madrid', 
    seasons: {"2324": {points: 43, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 3, yellowCards: 1, redCards: 0, matches: 20},
    "2223": {points: 97, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 3, yellowCards: 3, redCards: 0, matches: 30},
    "2122": {points: 106, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 0, yellowCards: 4, redCards: 0, matches: 41},
    "2021": {points: 133, againstGoals: 0, zeroGoals: 0 ,goals: 2, asists: 8, yellowCards: 5, redCards: 0, matches: 34}},
    },
    {name: 'Nacho Fernández', position: 'DFC', points: 22, price: 1500000, team: 'Madrid', 
    seasons: {"2324": {points: 22, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 2, redCards: 2, matches: 24},
    "2223": {points: 90, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 1, yellowCards: 9, redCards: 0, matches: 44},
    "2122": {points: 109, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 0, yellowCards: 9, redCards: 0, matches: 42},
    "2021": {points: 133, againstGoals: 0, zeroGoals: 0 ,goals: 1, asists: 1, yellowCards: 10, redCards: 0, matches: 33}},
    },
    {name: 'Arda Güler', position: 'MC', points: 3, price: 150000, team: 'Madrid', 
    seasons: {"2324": {points: 3, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 3},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 6, asists: 7, yellowCards: 2, redCards: 0, matches: 35},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 7, asists: 11, yellowCards: 1, redCards: 0, matches: 24},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Auréllen Tchouaméni', position: 'MC', points: 70, price: 10000000, team: 'Madrid', 
    seasons: {"2324": {points: 70, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 6, redCards: 0, matches: 22},
    "2223": {points: 106, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 4, yellowCards: 4, redCards: 0, matches: 50},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 5, asists: 3, yellowCards: 13, redCards: 1, matches: 50},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 3, asists: 4, yellowCards: 8, redCards: 1, matches: 42}},
    },
    {name: 'Brahim Dïaz', position: 'MC', points: 79, price: 11500000, team: 'Madrid', 
    seasons: {"2324": {points: 79, againstGoals: 0, zeroGoals: 0, goals: 6, asists: 3, yellowCards: 2, redCards: 0, matches: 24},
    "2223": {points: 5, againstGoals: 0, zeroGoals: 0, goals: 7, asists: 7, yellowCards: 4, redCards: 0, matches: 45},
    "2122": {points: 37, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 4, yellowCards: 5, redCards: 0, matches: 40},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 7, asists: 4, yellowCards: 3, redCards: 0, matches: 39}},
    },
    {name: 'Dani Ceballos', position: 'MC', points: 20, price: 500000, team: 'Madrid', 
    seasons: {"2324": {points: 20, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 1, redCards: 0, matches: 18},
    "2223": {points: 103, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 9, yellowCards: 9, redCards: 0, matches: 46},
    "2122": {points: 31, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 1, yellowCards: 1, redCards: 0, matches: 18},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 0, asists: 3, yellowCards: 4, redCards: 1, matches: 40}},
    },
    {name: 'Eduardo Camavinga', position: 'MC', points: 72, price: 10500000, team: 'Madrid', 
    seasons: {"2324": {points: 72, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 2, yellowCards: 7, redCards: 0, matches: 23},
    "2223": {points: 162, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 2, yellowCards: 13, redCards: 0, matches: 59},
    "2122": {points: 105, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 2, yellowCards: 11, redCards: 0, matches: 46},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 1, asists: 3, yellowCards: 7, redCards: 0, matches: 39}},
    },
    {name: 'Fede Valverde', position: 'MC', points: 115, price: 15000000, team: 'Madrid', 
    seasons: {"2324": {points: 115, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 3, yellowCards: 1, redCards: 0, matches: 31},
    "2223": {points: 185, againstGoals: 0, zeroGoals: 0, goals: 12, asists: 7, yellowCards: 6, redCards: 0, matches: 56},
    "2122": {points: 125, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 2, yellowCards: 5, redCards: 0, matches: 46},
    "2021": {points: 104, againstGoals: 0, zeroGoals: 0 ,goals: 3, asists: 1, yellowCards: 4, redCards: 0, matches: 33}},
    },
    {name: 'Jude Bellingham', position: 'MC', points: 183, price: 27500000, team: 'Madrid', 
    seasons: {"2324": {points: 183, againstGoals: 0, zeroGoals: 0, goals: 18, asists: 8, yellowCards: 9, redCards: 0, matches: 26},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 14, asists: 7, yellowCards: 11, redCards: 0, matches: 42},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 6, asists: 14, yellowCards: 11, redCards: 0, matches: 44},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 ,goals: 4, asists: 4, yellowCards: 9, redCards: 1, matches: 46}},
    },
    {name: 'Luka Modric', position: 'MC', points: 76, price: 12500000, team: 'Madrid', 
    seasons: {"2324": {points: 76, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 6, yellowCards: 1, redCards: 0, matches: 24},
    "2223": {points: 144, againstGoals: 0, zeroGoals: 0, goals: 6, asists: 6, yellowCards: 7, redCards: 0, matches: 52},
    "2122": {points: 166, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 12, yellowCards: 7, redCards: 0, matches: 45},
    "2021": {points: 229, againstGoals: 0, zeroGoals: 0 ,goals: 6, asists: 6, yellowCards: 4, redCards: 0, matches: 48}},
    },
    {name: 'Toni Kroos', position: 'MC', points: 119, price: 14500000, team: 'Madrid', 
    seasons: {"2324": {points: 119, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 7, yellowCards: 2, redCards: 0, matches: 29},
    "2223": {points: 153, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 6, yellowCards: 2, redCards: 0, matches: 52},
    "2122": {points: 145, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 3, yellowCards: 6, redCards: 0, matches: 45},
    "2021": {points: 179, againstGoals: 0, zeroGoals: 0 ,goals: 3, asists: 12, yellowCards: 10, redCards: 0, matches: 42}},
    },
    {name: 'Joselu', position: 'DC', points: 76, price: 10250000, team: 'Madrid', 
    seasons: {"2324": {points: 76, againstGoals: 0, zeroGoals: 0, goals: 10, asists: 4, yellowCards: 0, redCards: 0, matches: 30},
    "2223": {points: 200, againstGoals: 0, zeroGoals: 0, goals: 17, asists: 3, yellowCards: 2, redCards: 0, matches: 37},
    "2122": {points: 204, againstGoals: 0, zeroGoals: 0, goals: 14, asists: 5, yellowCards: 0, redCards: 0, matches: 38},
    "2021": {points: 193, againstGoals: 0, zeroGoals: 0 ,goals: 11, asists: 3, yellowCards: 1, redCards: 0, matches: 38}},
    },
    {name: 'Rodrygo', position: 'DC', points: 119, price: 19250000, team: 'Madrid', 
    seasons: {"2324": {points: 119, againstGoals: 0, zeroGoals: 0, goals: 12, asists: 7, yellowCards: 2, redCards: 0, matches: 31},
    "2223": {points: 203, againstGoals: 0, zeroGoals: 0, goals: 19, asists: 11, yellowCards: 4, redCards: 0, matches: 57},
    "2122": {points: 129, againstGoals: 0, zeroGoals: 0, goals: 9, asists: 10, yellowCards: 5, redCards: 0, matches: 49},
    "2021": {points: 74, againstGoals: 0, zeroGoals: 0 ,goals: 2, asists: 8, yellowCards: 0, redCards: 0, matches: 33}},
    },
    {name: 'Vinicius Júnior', position: 'DC', points: 73, price: 20000000, team: 'Madrid', 
    seasons: {"2324": {points: 73, againstGoals: 0, zeroGoals: 0, goals: 11, asists: 4, yellowCards: 3, redCards: 0, matches: 19},
    "2223": {points: 222, againstGoals: 0, zeroGoals: 0, goals: 23, asists: 21, yellowCards: 16, redCards: 0, matches: 55},
    "2122": {points: 276, againstGoals: 0, zeroGoals: 0, goals: 22, asists: 20, yellowCards: 7, redCards: 0, matches: 52},
    "2021": {points: 112, againstGoals: 0, zeroGoals: 0 ,goals: 6, asists: 7, yellowCards: 4, redCards: 0, matches: 49}},
    },
    {name: 'Jan Oblak', position: 'POR', points: 104, price: 15000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 104, againstGoals: 40, zeroGoals: 11, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 34},
    "2223": {points: 117, againstGoals: 31, zeroGoals: 16, goals: 0, asists: 0, yellowCards: 1, redCards: 0, matches: 38},
    "2122": {points: 113, againstGoals: 57, zeroGoals: 16, goals: 0, asists: 0, yellowCards: 2, redCards: 0, matches: 51},
    "2021": {points: 201, againstGoals: 36, zeroGoals: 20 ,goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 46}},
    },
    {name: 'Axel Witsel', position: 'DFC', points: 104, price: 10000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 104, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 3, redCards: 0, matches: 33},
    "2223": {points: 100, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 1, yellowCards: 3, redCards: 1, matches: 43},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 0, yellowCards: 5, redCards: 0, matches: 41},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 1, asists: 0, yellowCards: 5, redCards: 0, matches: 22}},
    },
    {name: 'Cesar Azpilicueta', position: 'DFC', points: 51, price: 3000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 51, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 1, yellowCards: 5, redCards: 0, matches: 22},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 4, redCards: 0, matches: 32},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 3, yellowCards: 5, redCards: 0, matches: 47},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 1, asists: 3, yellowCards: 7, redCards: 0, matches: 43}},
    },
    {name: 'Gabriel Paulista', position: 'DFC', points: 55, price: 3250000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 55, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 4, redCards: 1, matches: 19},
    "2223": {points: 62, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 2, redCards: 2, matches: 23},
    "2122": {points: 105, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 4, redCards: 0, matches: 21},
    "2021": {points: 139, againstGoals: 0, zeroGoals: 0 , goals: 4, asists: 2, yellowCards: 7, redCards: 0, matches: 32}},
    },
    {name: 'José María Giménez', position: 'DFC', points: 47, price: 3000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 47, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 1, yellowCards: 6, redCards: 0, matches: 23},
    "2223": {points: 145, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 13, redCards: 0, matches: 36},
    "2122": {points: 105, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 1, yellowCards: 8, redCards: 1, matches: 33},
    "2021": {points: 91, againstGoals: 0, zeroGoals: 0 , goals: 1, asists: 0, yellowCards: 7, redCards: 0, matches: 26}},
    },
    {name: 'Mario Hermoso', position: 'DFC', points: 82, price: 7000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 82, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 9, redCards: 0, matches: 30},
    "2223": {points: 126, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 2, yellowCards: 6, redCards: 2, matches: 34},
    "2122": {points: 67, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 1, yellowCards: 8, redCards: 1, matches: 34},
    "2021": {points: 144, againstGoals: 0, zeroGoals: 0 , goals: 2, asists: 1, yellowCards: 5, redCards: 0, matches: 38}},
    },
    {name: 'Nahuel Molina', position: 'DFC', points: 70, price: 4000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 70, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 4, yellowCards: 3, redCards: 0, matches: 31},
    "2223": {points: 146, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 4, yellowCards: 8, redCards: 1, matches: 43},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 8, asists: 5, yellowCards: 5, redCards: 1, matches: 37},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 2, asists: 5, yellowCards: 1, redCards: 0, matches: 31}},
    },
    {name: 'Reinildo Mandava', position: 'DFC', points: 22, price: 1500000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 22, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 1, redCards: 0, matches: 4},
    "2223": {points: 107, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 7, redCards: 2, matches: 33},
    "2122": {points: 64, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 0, yellowCards: 15, redCards: 0, matches: 48},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 0, asists: 0, yellowCards: 2, redCards: 1, matches: 35}},
    },
    {name: 'Stefan Savic', position: 'DFC', points: 42, price: 1500000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 42, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 3, redCards: 1, matches: 19},
    "2223": {points: 61, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 9, redCards: 3, matches: 29},
    "2122": {points: 96, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 13, redCards: 0, matches: 33},
    "2021": {points: 161, againstGoals: 0, zeroGoals: 0 , goals: 1, asists: 0, yellowCards: 17, redCards: 1, matches: 42}},
    },
    {name: 'Arthur Vermeeren', position: 'MC', points: 2, price: 100000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 2, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 6, yellowCards: 3, redCards: 0, matches: 33},
    "2223": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 2, asists: 2, yellowCards: 2, redCards: 0, matches: 40},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Koke', position: 'MC', points: 88, price: 8000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 88, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 3, yellowCards: 6, redCards: 0, matches: 30},
    "2223": {points: 136, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 3, yellowCards: 6, redCards: 0, matches: 42},
    "2122": {points: 99, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 3, yellowCards: 7, redCards: 0, matches: 43},
    "2021": {points: 178, againstGoals: 0, zeroGoals: 0 , goals: 1, asists: 2, yellowCards: 11, redCards: 0, matches: 45}},
    },
    {name: 'Marcos Llorente', position: 'MC', points: 100, price: 11000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 100, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 5, yellowCards: 3, redCards: 0, matches: 33},
    "2223": {points: 100, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 3, yellowCards: 5, redCards: 0, matches: 29},
    "2122": {points: 109, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 3, yellowCards: 8, redCards: 0, matches: 40},
    "2021": {points: 252, againstGoals: 0, zeroGoals: 0 , goals: 13, asists: 12, yellowCards: 8, redCards: 0, matches: 45}},
    },
    {name: 'Pablo Barrios', position: 'MC', points: 69, price: 6000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 69, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 2, yellowCards: 3, redCards: 0, matches: 19},
    "2223": {points: 61, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 1, yellowCards: 4, redCards: 0, matches: 38},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Rodrigo de Paul', position: 'MC', points: 101, price: 10000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 101, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 5, yellowCards: 5, redCards: 1, matches: 29},
    "2223": {points: 140, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 8, yellowCards: 7, redCards: 0, matches: 38},
    "2122": {points: 147, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 2, yellowCards: 9, redCards: 0, matches: 48},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 9, asists: 11, yellowCards: 4, redCards: 2, matches: 38}},
    },
    {name: 'Rodrigo Riquelme', position: 'MC', points: 74, price: 100000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 74, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 4, yellowCards: 1, redCards: 0, matches: 28},
    "2223": {points: 165, againstGoals: 0, zeroGoals: 0, goals: 5, asists: 4, yellowCards: 1, redCards: 0, matches: 35},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 0}},
    },
    {name: 'Samuel Lino', position: 'MC', points: 110, price: 13000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 110, againstGoals: 0, zeroGoals: 0, goals: 6, asists: 5, yellowCards: 2, redCards: 0, matches: 27},
    "2223": {points: 192, againstGoals: 0, zeroGoals: 0, goals: 8, asists: 3, yellowCards: 4, redCards: 0, matches: 41},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 14, asists: 5, yellowCards: 4, redCards: 0, matches: 38},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 11, asists: 0, yellowCards: 2, redCards: 0, matches: 37}},
    },
    {name: 'Saúl Ñíguez', position: 'MC', points: 78, price: 5000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 78, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 5, yellowCards: 6, redCards: 0, matches: 33},
    "2223": {points: 91, againstGoals: 0, zeroGoals: 0, goals: 3, asists: 1, yellowCards: 8, redCards: 0, matches: 38},
    "2122": {points: 14, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 1, yellowCards: 3, redCards: 0, matches: 26},
    "2021": {points: 117, againstGoals: 0, zeroGoals: 0 , goals: 2, asists: 1, yellowCards: 12, redCards: 0, matches: 41}},
    },
    {name: 'Thomas Lemar', position: 'DC', points: 2, price: 100000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 2, againstGoals: 0, zeroGoals: 0, goals: 0, asists: 0, yellowCards: 0, redCards: 0, matches: 3},
    "2223": {points: 85, againstGoals: 0, zeroGoals: 0, goals: 1, asists: 3, yellowCards: 2, redCards: 0, matches: 32},
    "2122": {points: 121, againstGoals: 0, zeroGoals: 0, goals: 4, asists: 6, yellowCards: 2, redCards: 0, matches: 35},
    "2021": {points: 115, againstGoals: 0, zeroGoals: 0 , goals: 2, asists: 5, yellowCards: 5, redCards: 0, matches: 36}},
    },
    {name: 'Álvaro Morata', position: 'DC', points: 130, price: 17000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 130, againstGoals: 0, zeroGoals: 0, goals: 19, asists: 3, yellowCards: 3, redCards: 1, matches: 32},
    "2223": {points: 178, againstGoals: 0, zeroGoals: 0, goals: 15, asists: 3, yellowCards: 5, redCards: 0, matches: 45},
    "2122": {points: 0, againstGoals: 0, zeroGoals: 0, goals: 12, asists: 9, yellowCards: 5, redCards: 0, matches: 48},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 20, asists: 12, yellowCards: 5, redCards: 1, matches: 44}},
    },
    {name: 'Ángel Correa', position: 'DC', points: 70, price: 9000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 70, againstGoals: 0, zeroGoals: 0, goals: 5, asists: 2, yellowCards: 5, redCards: 0, matches: 28},
    "2223": {points: 136, againstGoals: 0, zeroGoals: 0, goals: 10, asists: 4, yellowCards: 2, redCards: 1, matches: 45},
    "2122": {points: 170, againstGoals: 0, zeroGoals: 0, goals: 13, asists: 6, yellowCards: 5, redCards: 1, matches: 49},
    "2021": {points: 172, againstGoals: 0, zeroGoals: 0 , goals: 9, asists: 11, yellowCards: 3, redCards: 0, matches: 48}},
    },
    {name: 'Antoine Griezmann', position: 'DC', points: 164, price: 25000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 164, againstGoals: 0, zeroGoals: 0, goals: 18, asists: 7, yellowCards: 5, redCards: 0, matches: 34},
    "2223": {points: 302, againstGoals: 0, zeroGoals: 0, goals: 16, asists: 19, yellowCards: 3, redCards: 0, matches: 48},
    "2122": {points: 101, againstGoals: 0, zeroGoals: 0, goals: 8, asists: 7, yellowCards: 3, redCards: 1, matches: 39},
    "2021": {points: 183, againstGoals: 0, zeroGoals: 0 , goals: 20, asists: 13, yellowCards: 5, redCards: 0, matches: 51}},
    },
    {name: 'Memphis Depay', position: 'DC', points: 64, price: 6000000, team: 'Atlético de Madrid', 
    seasons: {"2324": {points: 64, againstGoals: 0, zeroGoals: 0, goals: 7, asists: 2, yellowCards: 1, redCards: 0, matches: 19},
    "2223": {points: 63, againstGoals: 0, zeroGoals: 0, goals: 5, asists: 0, yellowCards: 1, redCards: 0, matches: 13},
    "2122": {points: 173, againstGoals: 0, zeroGoals: 0, goals: 13, asists: 2, yellowCards: 4, redCards: 0, matches: 38},
    "2021": {points: 0, againstGoals: 0, zeroGoals: 0 , goals: 22, asists: 12, yellowCards: 5, redCards: 0, matches: 40}},
    }]; */

  const app = initializeFirebase();
  const auth = getFirebaseAuth();

  //Functions
  useFocusEffect(
    useCallback(() => {
      // Restablecer los valores de los email y password cuando la pantalla se enfoca
      setEmail("");
      setPassword("");
    }, [])
  );

  const handleLogin = () => {
    loginUser(auth, email, password)
    .then(() => {
      getUserLeague()
      .then((data) => {
        if (data == '0') {
          navigation.navigate('CreateLeague');
        } else if (data == '1') {
          navigation.navigate('BottomTab');
        }
        //handleAddPlayers();
      })
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  }

  /* const handleAddPlayers = () => {
    addPlayersToFirestore(players)
    .then(() => {
      console.log('jugadores añadidos');
    })
    .catch(error => {
      Alert.alert(error.message);
    })
  }
 */
  return (
    <View style = {styles.MainContainer}>
      <Ionicons 
        name="football" 
        size={100} 
        color="black"
        style = {styles.FootballIcon}
      />
      <Text style = {styles.MainTitle}>Fantasy App</Text>
      <Text style = {styles.PrincipalTitle}>Bienvenido</Text>
      <View style = {styles.InputsContainer}>
        <TextInput
          style = {styles.Input}
          onChangeText={setEmail}
          placeholder={'Email'}
          value = {email}>
        </TextInput>
        <TextInput
          style = {styles.Input}
          onChangeText={setPassword}
          placeholder={'Contraseña'}
          value = {password}>
        </TextInput>
        <TouchableOpacity 
        onPress={handleLogin}
        style = {styles.LoginButton}>
          <Text style = {styles.LoginText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <View style = {styles.BottomTextContainer}>
          <Text style = {styles.NotAnAccountText}>No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style = {styles.GoToRegisterText}>Registrate</Text>
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
  InputsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 250,
  },
  BottomTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30
  },
  MainTitle: {
    marginBottom: 100,
    color: '#2DBC07',
    fontSize: 55,
    fontWeight: 'bold',
  },
  PrincipalTitle: {
    marginBottom: 15,
    fontSize: 40,
    fontWeight: 'bold',
  },
  Input: {
    marginBottom: 10,
    width: 300,
    height: 40,
    backgroundColor: '#2DBC07',
    borderWidth: 2,
    borderRadius: 15,
    paddingLeft: 7,
    paddingRight: 7,
  },
  LoginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 200,
    height: 40,
    backgroundColor: 'green',
    borderWidth: 1,
    borderRadius: 15,
  },
  LoginText: {
    fontWeight: 'bold',
  },
  GoToRegisterText: {
    marginLeft: 5,
    color: 'blue'
  },
  FootballIcon: {
    zIndex: -2,
    top: 90,
    left: 130
  }
});

export default Main;