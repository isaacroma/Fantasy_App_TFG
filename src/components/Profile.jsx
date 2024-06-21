import React, {useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native';
import i18next, {languageResources} from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { getUserInfo } from './FirebaseFunctions';

function Profile() {

  //Variables
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [editButtonPressed, setEditButtonPressed] = useState(false);
  const [buttonText, setButtonText] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  //Functions
  useEffect(() => {
    handlegetUserInfo();
    setButtonText(t('Editar'));
  }, [])

  const handlegetUserInfo = async () => {
    getUserInfo()
    .then((data) => {
        setUserInfo(data);
    })
    .catch(error => {
        Alert.alert(error.message);
    });
  }

  const handleEditProfile = async () => {
    setEditButtonPressed(!editButtonPressed);
    if (editButtonPressed === true) {
        setButtonText(t('Editar'));
    } else {
        setButtonText(t('Guardar'));
    }
  }

  if (!userInfo) {
    return (
      <View style={styles.MainContainer}>
        <Text style={styles.PrincipalTitle}>{t('Cargando...')}</Text>
      </View>
    );
  }

  return (
    <View style = {styles.MainContainer}>
        <Text style = {styles.PrincipalTitle}>{t('Perfil')}</Text>
        <View style = {styles.ProfileContainer}>
            <View style = {styles.EmailContainer}>
                <Text style = {styles.ProfileTitles}>{t("Email")}:</Text>
                <Text style = {styles.LeagueText}>{userInfo.email}</Text>
            </View>
            <View style = {styles.PasswordContainer}>
                <Text style = {styles.ProfileTitles}>{t('Contraseña')}:</Text>
                <Text style = {styles.LeagueText}>123456789</Text>
            </View>
            <View style = {styles.UsernameContainer}>
                <Text style = {styles.ProfileTitles}>{t('Username')}:</Text>
                <Text style = {styles.LeagueText}>{userInfo.username}</Text>
            </View>
            <View style = {styles.LeagueContainer}>
                <Text style = {styles.ProfileTitles}>{t('Liga')}:</Text>
                <Text style = {styles.LeagueText}>{userInfo.league}</Text>
            </View>
        </View>
        <View style = {styles.EditButtonContainer}>
            <TouchableOpacity onPress={handleEditProfile}
            style = {[styles.EditButton, { backgroundColor: editButtonPressed ? '#2DBC07' : '#DCDCDC' }]}>
                <Text style = {styles.EditText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
        <View style = {styles.BackButtonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Configuration')}
            style = {styles.BackButton}>
                <Text style = {styles.BackText}>{t('Atras')}</Text>
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
    ProfileContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 50
    },
    EmailContainer: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: 40
    },
    PasswordContainer: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: 40
    },
    UsernameContainer: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: 40
    },
    LeagueContainer: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginLeft: 40
    },
    BackButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    EditButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    //Inputs
    Input: {
        width: 175,
        height: 40,
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 7,
        paddingRight: 7,
        marginLeft: 10
    },

    //Buttons
    BackButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        height: 50,
        width: 300,
        marginTop: 10,
        backgroundColor: '#BA82F1'
    },
    EditButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        height: 50,
        width: 300,
        marginTop: 225,
        backgroundColor: '#D3D3D3'
    },

    //Text
    PrincipalTitle: {
        marginTop: '15%',
        marginBottom: 30,
        fontSize: 40,
        fontWeight: 'bold',
    },
    ProfileTitles: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    LeagueText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
        color: 'rgba(0, 0, 0, 0.5)'
    },
    BackText: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    EditText: {
        fontWeight: 'bold',
        fontSize: 17,
    },

});

export default Profile;