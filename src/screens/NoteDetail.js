import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, ImageBackground, Button } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScreenType } from '../constants/constants';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
// import {schedulePushNotification} from './../components/Notifications';

import { useNavigation } from "@react-navigation/native"








/////

const NoteDetail = ({ route }) => {
  const date = format(route.params.time, 'MMMM dd, yyyy HH:MMa');
  const [noteId, setNoteId] = useState(route.params.id);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState(route.params);
  const [noteCreationDate] = useState(date);
  const [modalInputText, setModalInputText] = useState(route.params.note);
  const navigation = useNavigation();


  
  const [background] = useState({uri: require('./../img/bg4.jpg')});
  const [darkBackground] = useState({uri: require('./../img/bg-dark.jpg')});
  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);
  useEffect(() => { 
    setDarkMode(mode);
  }, [mode]);

  const saveNotes = async (data) => {
    await AsyncStorage.setItem("NOTES", JSON.stringify(data));
    setNotes(data);
  }

  const handleEditItem = async (noteId, text) => {
    const result = await AsyncStorage.getItem('NOTES');

    let notes = [];
    if (result !== null) notes = JSON.parse(result);
    // console.log(notes);
    console.log(noteId, 'noteId');
    const updatedNotes = notes.filter(item => {
      if (item.id === noteId) {
        console.log('inside', text);
        item["note"] = text;
        return item;
      }
      return item;
    })
    saveNotes(updatedNotes);
  }

  const handleChangeText = (text) => {
    handleEditItem(noteId, text);
  }

  const openScheduler = (note) => {
    navigation.navigate('NotificationScreen', { ...note });
  };



  return (
    <ImageBackground source = {darkMode ? darkBackground.uri : background.uri } style={styles.gradient} >
    <BlurView intensity={40} tint="light" style={styles.blurContainer}>
      

    <LinearGradient
      // Background Linear Gradient
      colors={['rgba(60,60,60, 0)', 'rgba(60,60,60, 0.1)']}
      style={styles.gradient}>
      {/* <BlurView intensity={40} tint="light" style={styles.blurContainer}> */}
        <ScrollView style={styles.container} keyboardDismissMode='interactive'>
          <View style={styles.dateView}>
            <Text style={[darkMode ? {color: 'rgba(177, 177, 177, 1)'} : {color: 'rgba(177, 177, 177, 1)'}]}>Created: {noteCreationDate}</Text>
          </View>
          <TextInput
            value={note}
            multiline={true}
            autoFocus
            selectionColor='#fff'
            style={[styles.input, darkMode && {color: 'white'}]}
            defaultValue={modalInputText}
            editable={true}
            onChangeText={(text) => handleChangeText(text)}
          />
          <KeyboardAvoidingView keyboardVerticalOffset={150} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bottom}>

          <Button title="Schedule" onPress={() => {openScheduler(note)}} />
          </KeyboardAvoidingView>
        </ScrollView>
      {/* </BlurView> */}
    </LinearGradient>
    </BlurView>
  </ImageBackground>
  )
}

export default NoteDetail

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    padding: 30,
    paddingTop: 50,
    // backgroundColor: 'rgba(171, 171, 171, 0.1)'
  },
  blurContainer: {
    flex: 1,
  },
  bottom:
  {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 36,
  },
  button:
  {
    marginBottom: 30,
  },
  gradient: {
    flex: 1,
  },
  input: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  dateView: {
    flex: 1,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -40,
  },
})