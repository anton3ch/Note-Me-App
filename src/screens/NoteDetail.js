import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScreenType } from '../constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';





const NoteDetail = ({route, navigation}) => {

  const [noteId, setNoteId] = useState(route.params.note);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState();
  const [modalInputText, setModalInputText] = useState();
  const [editNoteId, setEditNoteId] = useState();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
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
    setModalInputText(text);
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
    <View style={styles.container} >
      <Text>
        {noteId}
      </Text>
      <View style={styles.modalView}>
            <TextInput
            style={styles.modalTextInput}
            onChangeText={(text) => handleChangeText(text)}

            defaultValue={modalInputText}
            editable={true}/>
              
            <TouchableOpacity
              onPress={() => onPressSaveEdit()}
              style={styles.touchableSave}
            >
              {/* <Text style={styles.saveText}>Save</Text> */}

            </TouchableOpacity>

          </View>
    </View>
  )
}

export default NoteDetail

const styles = StyleSheet.create({
  container: {
  
  },
});