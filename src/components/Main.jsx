import React, {useState, useCallback} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { initializeFirebase, getFirebaseAuth, loginUser, getUserLeague } from './FirebaseFunctions';


function Main() {

  //Variables
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      })
    })
    .catch(error => {
      Alert.alert(error.message);
    });
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