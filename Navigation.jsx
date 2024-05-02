import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

import Main from './src/components/Main.jsx';
import Register from './src/components/Register.jsx';
import CreateLeague from './src/components/CreateLeague.jsx';
import Team from './src/components/Team.jsx';

import Configuration from './src/components/Configuration.jsx';
import Market from './src/components/Market.jsx';
import SearchPlayers from './src/components/SearchPlayers.jsx';
import Clasification from './src/components/Clasification.jsx';


const HomeStackNavigator = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <HomeStackNavigator.Navigator
    initialRouteName='Home'>
      <HomeStackNavigator.Screen
        name="Home"
        component={Main}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
        name="CreateLeague"
        component={CreateLeague}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
        name="BottomTab"
        component={BottomTabBar}
        options={{
          headerShown: false
        }}
      />
    </HomeStackNavigator.Navigator>
  );
}

function BottomTabBar() {
  return (
    <Tab.Navigator initialRouteName='Team'
      screenOptions={{
        tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray'
      }}>
      <Tab.Screen 
        name="Search" 
        component={SearchPlayers}
        options={{
          tabBarLabel: 'Jugadores',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="magnifying-glass" color={color} size={size}/>
          )
        }}
      />
      <Tab.Screen 
        name="Market" 
        component={Market}
        options={{
          tabBarLabel: 'Mercado',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="money-bill-transfer" color={color} size={size}/>
          )
        }}
      />
      <Tab.Screen 
        name="Team" 
        component={Team}
        options={{
          tabBarLabel: 'Equipo',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="soccer-field" color={color} size={size}/>
          )
        }}
      />
      <Tab.Screen 
        name="Clasification" 
        component={Clasification}
        options={{
          tabBarLabel: 'Clasificación',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="trophy" color={color} size={size}/>
          )
        }}
      />
      <Tab.Screen 
        name="Configuration" 
        component={Configuration}
        options={{
          tabBarLabel: 'Configuración',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}