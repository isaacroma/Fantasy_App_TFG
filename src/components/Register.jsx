import React, {useState} from 'react'
import {useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getFirebaseAuth, createUser } from './FirebaseFunctions';


function Register() {

  //Variables
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getFirebaseAuth();

  //Functions
  const handleRegister = () => {
    createUser(auth, username, email, password)
    .then(() => {
      navigation.navigate('Home');
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
      <Text style = {styles.PrincipalTitle}>{t('Bienvenido')}</Text>
      <View style = {styles.InputsContainer}>
        <TextInput
          style = {styles.Input}
          onChangeText={setUsername}
          placeholder={t('Username')}>
        </TextInput>
        <TextInput
          style = {styles.Input}
          onChangeText={setEmail}
          placeholder={t('Email')}>
        </TextInput>
        <TextInput
          style = {styles.Input}
          secureTextEntry={true}
          onChangeText={setPassword}
          placeholder={t('Contraseña')}>
        </TextInput>
        <TouchableOpacity 
        onPress={handleRegister}
        style = {styles.RegisterButton}>
          <Text style = {styles.RegisterText}>{t('Registrarse')}</Text>
        </TouchableOpacity>
        <View style = {styles.BottomTextContainer}>
            <Text>{t('Ya tienes cuenta?')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style = {styles.GoToLoginText}>{t('Inicia sesión')}</Text>
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
    height: 300,
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
  RegisterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 200,
    height: 40,
    backgroundColor: 'green',
    borderWidth: 1,
    borderRadius: 15,
  },
  RegisterText: {
    fontWeight: 'bold',
  },
  GoToLoginText: {
    marginLeft: 5,
    color: 'blue'
  },
  FootballIcon: {
    zIndex: -2,
    top: 90,
    left: 130
  }
});

export default Register;