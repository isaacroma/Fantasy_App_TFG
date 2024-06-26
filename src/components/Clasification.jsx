import React, {useState, useRef, useEffect} from 'react'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Alert, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { getGeneralClassification, playRound } from './FirebaseFunctions';

function Clasification() {

    //Variables
    const {t} = useTranslation();
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const [isGeneralButtonActive, setisGeneralButtonActive] = useState(true);
    const [isJourneyButtonActive, setisJourneyButtonActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    //Functions
    useFocusEffect(
        React.useCallback(() => {
          scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }, [])
    );

    useEffect(() => {
        handlegetGeneralClassification();
    }, [])

    const handlegetGeneralClassification = async () => {
        getGeneralClassification()
        .then((data) => {
            setUsers(data);
        })
        .catch(error => {
            Alert.alert(error.message);
        });
    };

    const handlePlayRound = async () => {
        setIsLoading(true);
        playRound()
        .then((data) => {
            Alert.alert(t("Jornada jugada"));
            setIsLoading(false);
            handlegetGeneralClassification();
        })
        .catch(error => {
            Alert.alert(error.message);
        });
    };

    const handlePressGeneralButton = () => {
        setisGeneralButtonActive(true);
        setisJourneyButtonActive(false);
    };
    
    const handlePressJourneyButton = () => {
        setisGeneralButtonActive(false);
        setisJourneyButtonActive(true);
    };

    return (
        <View style = {styles.MainContainer}>
            <View style = {styles.HeaderContainer}>
                <Text style = {styles.PrincipalTitle}>{t('Clasificación')}</Text>
                <FontAwesome5 
                    name="trophy" 
                    size={70} 
                    color="#EBCC05"
                    style = {styles.TrophyIcon}
                />
            </View>
            <View style = {styles.ButtonsContainer}>
                <TouchableOpacity 
                    style = {[styles.GeneralButton, { backgroundColor: isGeneralButtonActive ? '#2DBC07' : '#DCDCDC' }]}
                    onPress={handlePressGeneralButton}>
                    <Text style = {styles.Text}>{t('General')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style = {[styles.JourneyButton, { backgroundColor: isJourneyButtonActive ? '#2DBC07' : '#DCDCDC' }]}
                    onPress={handlePressJourneyButton}>
                    <Text style = {styles.Text}>{t('Jornada')}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handlePlayRound()}>
                <Text>Jugar Jornada</Text>
            </TouchableOpacity>
            <ScrollView ref={scrollViewRef} style = {styles.ScrollView}>
                {users.map((user, index) => {
                    return (
                    <View style = {styles.UserContainer} key={index}>
                        <Text style = {styles.UserName}>{user.username}</Text>
                        <View style = {styles.UserPointsContainer}>
                            <Text style = {styles.UserPoints}>{user.points}</Text>
                        </View>
                    </View>
                    );
                })}
            </ScrollView>
            <View style = {styles.LoadingContainer}>
                {isLoading && <ActivityIndicator size="large" color="#0000ff" />} 
              </View>
        </View>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    HeaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    PrincipalTitle: {
        marginTop: 35,
        fontSize: 40,
        fontWeight: 'bold',
    },
    ButtonsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        height: '7%',
        borderBottomWidth: 2,
        marginBottom: 5,
    },
    GeneralButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,
        borderRadius: 15,
        backgroundColor: '#2DBC07',
        marginRight: 5,
        borderWidth: 1,
        elevation: 15,
        marginBottom: 5
    },
    JourneyButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,
        borderRadius: 15,
        backgroundColor: '#E8E8E8',
        marginLeft: 5,
        borderWidth: 1,
        elevation: 15,
        marginBottom: 5
    },
    Text: {
        fontWeight: 'bold'
    },
    LoadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        bottom: 200
    },

    //Icons
    TrophyIcon: {
        transform: [{ rotate: '-15deg' }],
        marginTop: 40,
        marginLeft: 15
    },

    //Users
    ScrollView: {
        backgroundColor: 'white',
        width: '100%'
    },
    UserContainer: {
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
    UserName: {
        fontWeight: 'bold',
        fontSize: 20,
        right: '80%'
    },
    UserPointsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        height: 30,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#BA82F1',
        left: '80%',
        elevation: 20
    },
    UserPoints: {
        fontWeight: 'bold',
        fontSize: 15
    }   
});

export default Clasification;