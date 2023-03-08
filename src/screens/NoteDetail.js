import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, ImageBackground, Button, Platform, Modal, Keyboard } from 'react-native'
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
import * as Haptics from 'expo-haptics';
import NotificationScreen from './NotificationScreen'
import {useWindowDimensions} from 'react-native';





/////

const NoteDetail = ({ route }) => {
  const {height} = useWindowDimensions();
  
  const date = format(route.params.time, 'MMMM dd, yyyy hh:mma');
  const [noteId, setNoteId] = useState(route.params.id);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState(route.params);
  const [noteCreationDate] = useState(date);
  const [modalInputText, setModalInputText] = useState(route.params.note);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();


  
  const [background] = useState({uri: require('./../img/bg4.jpg')});
  const [darkBackground] = useState({uri: require('./../img/bg-dark.jpg')});
  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);
  useEffect(() => { 
    setDarkMode(mode);
  }, [mode]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return (
        <TouchableOpacity style={styles.scheduleContainer} onPress={() => {setModalVisible(!modalVisible); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.light);}}>
          <Ionicons name="alarm-outline" style={[styles.sortIcon,  darkMode ? {color: 'rgba(214, 214, 214, 1)'} : {color: 'rgba(61, 61, 61, 1)'} ]} /><Text style={[styles.scheduleText, darkMode ? {color: 'rgba(214, 214, 214, 1)'} : {color: 'rgba(61, 61, 61, 1)'} ]}>Schedule</Text>
        </TouchableOpacity>
      )},
    });
  }, [darkMode, modalVisible]);

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
        console.log('update note', text);
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

  const handleModal = () => {
    setModalVisible(!modalVisible);
  }



  return (
    <ImageBackground source = {darkMode ? darkBackground.uri : background.uri } style={styles.gradient} >
    <BlurView intensity={40} tint="light" style={styles.blurContainer} 
    keyboardShouldPersistTaps='handled' keyboardDismissMode='onDrag'>
    <LinearGradient
      // Background Linear Gradient
      keyboardDismissMode='onDrag'
      colors={['rgba(60,60,60, 0)', 'rgba(60,60,60, 0.1)']}
      style={styles.gradient}
    >
      {/* <BlurView intensity={40} tint="light" style={styles.blurContainer}> */}
      <View style={styles.dateView}>
        <Text style={[darkMode ? {color: 'rgba(177, 177, 177, 1)'} : {color: 'rgba(177, 177, 177, 1)'}]}>Created: {noteCreationDate}</Text>
      </View>
          
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1,}} keyboardVerticalOffset={height / 100 * 14}
>
        <TextInput
          value={note}
          multiline={true}
          // autoFocus
          selectionColor={darkMode ? '#fff' : 'rgba(74, 74, 74, 0.8)'}
          style={[styles.input, darkMode && {color: 'white'}]}
          defaultValue={modalInputText}
          editable={true}
          onChangeText={(text) => handleChangeText(text)}
          // onScroll={Keyboard.dismiss}
        />
      </KeyboardAvoidingView>

      <View style={styles.centeredView}> 

          <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          // onRequestClose={() => {
          //   console.log('Modal has been closed.');
          //   setModalVisible(!modalVisible);
          // }}
          >
        <NotificationScreen noteId={noteId} handleModal={handleModal}></NotificationScreen>
        <TouchableOpacity style={styles.closeContainer} onPress={() => setModalVisible(!modalVisible)}>
          <Ionicons style={styles.closeIcon} name="close-outline"/>
        </TouchableOpacity>
        </Modal>
      </View>

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
    // paddingTop: 50, 
    
    // backgroundColor: 'rgba(171, 171, 171, 0.1)'
  },
  blurContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  input: {
    flex: 1,
    // height: '100%',
    margin: 15,
    marginTop: 35,
    marginRight: 0,
    marginBottom: 0,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingBottom: 15,
    height: '100%',
  },
  alarm: {
    fontSize: 30,
    color: 'rgba(145, 152, 255, 1)',
    transform: [{rotate: '19deg'}],

  },
  dateView: {
    flex: 1,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
  },
  sortIcon: {
    fontSize: 28,
  },
  scheduleText: {
    fontSize: 9,
  },
  scheduleContainer: {
    flex: 1,
    position: 'absolute',
    left: 5,
    width: 39,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  closeContainer: {
    position: 'absolute',
    right: 16,
    top: 48,
  },
  closeIcon: {
    fontSize: 35,
    color: 'black'
  },
})