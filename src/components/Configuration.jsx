import React, {useState} from 'react'
import {useNavigation} from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { getFirebaseAuth, signOutUser, checkloggedUser } from './FirebaseFunctions';

function Configuration() {

  //Variables
  const navigation = useNavigation();

  const auth = getFirebaseAuth();

  //Functions
  const handleSignOut = () => {
    signOutUser(auth)
    .then(() => {
        checkloggedUser()
        .then(() => {
            navigation.navigate('Home');
        })
    })
    .catch(error => {
        Alert.alert(error.message);
    });
  }

  return (
    <View style = {styles.MainContainer}>
        <Text style = {styles.PrincipalTitle}>Ajustes</Text>
        <View style = {styles.ProfileContainer}>
            <TouchableOpacity style = {styles.EditProfileButton}>
                <Text style = {styles.EditProfileText}>Editar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut}
            style = {styles.CloseSesionButton}>
                <Text style = {styles.CloseSesionText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
        <View style = {styles.LanguageContainer}>
            <Text style = {styles.LanguageTitle}>Idioma</Text>
            <View style = {styles.LanguageButtonsContainer}>
                <TouchableOpacity style = {styles.SpanishLanguageButton}>
                    <Text style = {styles.LanguageText}>Español</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.EnglishLanguageButton}>
                    <Text style = {styles.LanguageText}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.CatalanLanguageButton}>
                    <Text style = {styles.LanguageText}>Català</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style = {styles.LeaveContainer}>
            <TouchableOpacity style = {styles.LeaveButton}>
                <Text style = {styles.LeaveText}>Abandonar liga</Text>
            </TouchableOpacity>
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
    PrincipalTitle: {
        marginTop: '15%',
        marginBottom: 75,
        fontSize: 40,
        fontWeight: 'bold',
    },
    ProfileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 50
    },

    //Update profile
    EditProfileButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,
        borderWidth: 1,
        borderRadius: 15,
        marginRight: 10,
        backgroundColor: '#E8E8E8',
        elevation: 10
    },
    EditProfileText: {
        fontWeight: 'bold',
    },

    //Close sesion
    CloseSesionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,
        backgroundColor: '#D60000',
        borderWidth: 1,
        borderRadius: 15,
        marginLeft: 10,
        elevation: 10
    },
    CloseSesionText: {
        fontWeight: 'bold',
    },

    //Language
    LanguageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 100,
    },
    LanguageTitle: {
        fontWeight: 'bold',
        fontSize: 25
    },
    LanguageButtonsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        marginTop: 15
    },
    SpanishLanguageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 40,
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: '#2DBC07',
        elevation: 10
    },
    EnglishLanguageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 15,
        width: 100,
        height: 40,
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: 'grey',
        elevation: 10
    },
    CatalanLanguageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        //marginLeft: 15,
        width: 100,
        height: 40,
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: 'grey',
        elevation: 10
    },
    LanguageText: {
        fontWeight: 'bold'
    },

    //Leave League
    LeaveContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '85%',
    },
    LeaveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 15,
        width: 300,
        height: 40,
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: 'red',
        elevation: 10
    },
    LeaveText: {
        fontWeight: 'bold',
    }
});

export default Configuration;