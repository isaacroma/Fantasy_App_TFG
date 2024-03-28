import React, {useState} from 'react'
import {useNavigation} from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';

function Clasification() {

  //Navigation
  const navigation = useNavigation();

  //Variables
  const [users, setUsers] = useState(['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8']);


  //Functions
  const renderItem =({item}) => {
    
    return (
        <View style={styles.UsersWrapper}>
            <Text style = {styles.UserName}>{users}</Text>
        </View>
    )
  }

  return (
    <View style = {styles.MainContainer}>
        <View style = {styles.HeaderContainer}>
            <Text style = {styles.PrincipalTitle}>Clasificación</Text>
            <FontAwesome5 
                name="trophy" 
                size={70} 
                color="#EBCC05"
                style = {styles.TrophyIcon}
            />
        </View>
        <View style = {styles.ButtonsContainer}>
            <TouchableOpacity style = {styles.GeneralButton}>
                <Text style = {styles.Text}>General</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.JourneyButton}>
                <Text style = {styles.Text}>Jornada</Text>
            </TouchableOpacity>
        </View>
        <View style = {styles.UsersContainer}>
            <FlatList
                data={users}
                renderItem={renderItem}/>
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
    HeaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
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
        elevation: 15
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
        elevation: 15
    },
    Text: {
        fontWeight: 'bold'
    },
    UsersContainer: {
        width: '100%',
        height: 550,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8E8E8',
        //borderRadius: 15,
        marginTop: 10,
        borderTopWidth: 2
    },
    UsersWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderBottomWidth: 1,
        height: 75,
        width: 400,
        borderRadius: 15,
    },

    //Icons
    TrophyIcon: {
        transform: [{ rotate: '-15deg' }],
        marginTop: 40,
        marginLeft: 15
    },
    
});

export default Clasification;