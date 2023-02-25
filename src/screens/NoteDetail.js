import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, {useState, useEffect} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScreenType } from '../constants/constants';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';



const NoteDetail = ({route, navigation}) => {

  const [noteId, setNoteId] = useState(route.params.note);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState();
  const [modalInputText, setModalInputText] = useState();
  // const [editNoteId, setEditNoteId] = useState();

  
  useFocusEffect(
    React.useCallback(() => {
    getNote()
  }, [])
  );

  const getNote = async () => {
    const result = await AsyncStorage.getItem('NOTES');
    let notes = [];
    if (result !== null) notes = JSON.parse(result);

    const foundNote = notes.find(item => item.id === noteId)
    setNote(foundNote);
    setModalInputText(foundNote.note);
    setNoteId(foundNote.id);
  }

  const saveNotes = async (data) => {
    await AsyncStorage.setItem("NOTES", JSON.stringify(data));
    setNotes(data);
  }

  const handleEditItem = async (noteId, text) => {
    const result = await AsyncStorage.getItem('NOTES');
    
    let notes = [];
    if (result !== null) notes = JSON.parse(result);
    console.log(notes);
    console.log(noteId, 'noteId');
    const updatedNotes = notes.filter(item => {
      if(item.id === noteId) {
        console.log('inside', text);
        item.note = text;
        return item;
      }
      return item;
    })
    saveNotes(updatedNotes);

  }

  const onPressSaveEdit = (text) => {
    handleEditItem(noteId, text);
  }

  const handleChangeText = (text) => {
    // setModalInputText(text);
    onPressSaveEdit(text);
  }

  useFocusEffect(
    React.useCallback(() => {



      return () => {
        onPressSaveEdit(modalInputText);

      };
    }, [])
  );



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
      <TouchableOpacity
              onPress={() => onPressSaveEdit()}
              style={styles.touchableSave}
            >
              {/* <Text style={styles.saveText}>Save</Text> */}

            </TouchableOpacity>
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