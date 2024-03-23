import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Main from './src/components/Main.jsx';
import Register from './src/components/Register.jsx';
import CreateLeague from './src/components/CreateLeague.jsx';

const HomeStackNavigator = createNativeStackNavigator();

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
    </HomeStackNavigator.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}