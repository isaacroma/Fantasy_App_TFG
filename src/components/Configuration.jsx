import React, {useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native';
import i18next, {languageResources} from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { getFirebaseAuth, signOutUser, checkloggedUser, getUserLanguage, changeUserLanguage } from './FirebaseFunctions';

function Configuration() {

  //Variables
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [CatButtonPressed, setCatButtonPressed] = useState(false);
  const [EspButtonPressed, setEspButtonPressed] = useState(true);
  const [EnButtonPressed, setEnButtonPressed] = useState(false);

  const auth = getFirebaseAuth();

  //Functions
  useEffect(() => {
    handleSetUserLanguage();
  }, [])

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
  };

  const handleSetUserLanguage = async () => {
    getUserLanguage()
    .then((data) => {
        if (data == 'cat') {
            setCatButtonPressed(true);
            setEnButtonPressed(false);
            setEspButtonPressed(false);
        } else if (data == 'es') {
            setCatButtonPressed(false);
            setEnButtonPressed(false);
            setEspButtonPressed(true);
        } else {
            setCatButtonPressed(false);
            setEnButtonPressed(true);
            setEspButtonPressed(false);
        }
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  };

  const handleChangeLanguage = (language) => {
    if (language == 'cat') {
        setCatButtonPressed(true);
        setEnButtonPressed(false);
        setEspButtonPressed(false);
    } else if (language == 'es') {
        setCatButtonPressed(false);
        setEnButtonPressed(false);
        setEspButtonPressed(true);
    } else {
        setCatButtonPressed(false);
        setEnButtonPressed(true);
        setEspButtonPressed(false);
    }
    changeUserLanguage(language)
    .then((data) => {
        i18next.changeLanguage(language);
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  };

  return (
    <View style = {styles.MainContainer}>
        <Text style = {styles.PrincipalTitle}>{t('Ajustes')}</Text>
        <View style = {styles.ProfileContainer}>
            <TouchableOpacity style = {styles.EditProfileButton}>
                <Text style = {styles.EditProfileText}>{t('Editar perfil')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut}
            style = {styles.CloseSesionButton}>
                <Text style = {styles.CloseSesionText}>{t('Cerrar sesión')}</Text>
            </TouchableOpacity>
        </View>
        <View style = {styles.LanguageContainer}>
            <Text style = {styles.LanguageTitle}>{t('Idioma')}</Text>
            <View style = {styles.LanguageButtonsContainer}>
                <TouchableOpacity onPress={() => handleChangeLanguage('es')}
                style = {[styles.SpanishLanguageButton, { backgroundColor: EspButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                    <Text style = {styles.LanguageText}>{t('Español')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChangeLanguage('en')}
                style = {[styles.EnglishLanguageButton, { backgroundColor: EnButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                    <Text style = {styles.LanguageText}>{t('English')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChangeLanguage('cat')}
                style = {[styles.CatalanLanguageButton, { backgroundColor: CatButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                    <Text style = {styles.LanguageText}>{t('Catalan')}</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style = {styles.LeaveContainer}>
            <TouchableOpacity style = {styles.LeaveButton}>
                <Text style = {styles.LeaveText}>{t('Abandonar liga')}</Text>
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