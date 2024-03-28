import React, {useState} from 'react'
import {useNavigation} from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Image, ScrollView } from 'react-native';

function Team() {

  //Navigation
  const navigation = useNavigation();



  return (
    <View style = {styles.MainContainer}>
      <View style = {styles.HeaderContainer}>
        <Text style = {styles.PrincipalTitle}>Equipo</Text>
        <View style = {styles.MoneyContainer}>
          <Text style = {styles.Text}>500.000</Text>
        </View>
      </View>
      <ScrollView style = {styles.ScrollView}>
        <View style = {styles.ImageContainer}>
          <Image
            source={require("../../assets/Campo_de_futbol.png")}
            style={styles.Image}
          />
        </View>
        <View style = {styles.PlayersContainer}>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.Player}>
            <Text style = {styles.Text}>Player1</Text>
            <TouchableOpacity style = {styles.SellButton}>
              <Text style = {styles.Text}>Vender</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: 'red',
    width: '100%',
    height: 150,
    marginTop: '7%',
    borderBottomWidth: 2,
    elevation: 20,
    flexDirection: 'row'
  },
  MoneyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    width: 150,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    left: 35,
    elevation: 20

  },
  ScrollView: {
    backgroundColor: 'white',
    width: '100%'
  },

  //Text
  PrincipalTitle: {
    fontSize: 40,
    fontWeight: 'bold',
  },

  //Image
  ImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 550,
    backgroundColor: 'white',
  },
  Image: {
    width: 550,
    height: 550,
    zIndex: -2
  },

  //Players
  PlayersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'grey',
    borderTopWidth: 1
  },
  Player: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    marginTop: 5,
    borderBottomWidth: 1
  },
  SellButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 35,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'green',
    marginLeft: 175
  },
  Text: {
    fontWeight: 'bold'
  }
});

export default Team;