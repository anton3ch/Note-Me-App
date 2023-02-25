import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScreenType } from '../constants/constants';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';



const NoteDetail = ({ route, navigation }) => {

  const [noteId, setNoteId] = useState(route.params.id);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState(route.params);
  const [modalInputText, setModalInputText] = useState(route.params.note);
  console.log(route.params, 'psramas');

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

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={['white', 'rgba(60,60,60, 0.1)']}
      style={styles.gradient}>
      <BlurView intensity={40} tint="light" style={styles.blurContainer}>
        <ScrollView style={styles.container} keyboardDismissMode='interactive'>
          <TextInput
            value={note}
            multiline={true}
            autoFocus
            selectionColor='#fff'
            style={styles.input}
            defaultValue={modalInputText}
            editable={true}
            onChangeText={(text) => handleChangeText(text)}
          />
          <KeyboardAvoidingView keyboardVerticalOffset={150} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bottom}>

          </KeyboardAvoidingView>
        </ScrollView>
      </BlurView>
    </LinearGradient>
  )
}

export default NoteDetail

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    padding: 30,
    paddingTop: 80,
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
})