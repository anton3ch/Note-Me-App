import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, Button, ScrollView, TouchableHighlight } from 'react-native'
import React, { useState, Component, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenType } from '../constants/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { v4 } from 'uuid';
import {Dimensions} from 'react-native';
import { VibrancyView } from "@react-native-community/blur/";
import { BlurView } from 'expo-blur';
import { useNavigation } from "@react-navigation/native"
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";

const AddNote = () => {
  const [note, setNote] = useState('');
  const navigation = useNavigation();

  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);


  useEffect(() => { 
    setDarkMode(mode);
  }, [mode]);
  // let richText = React.createRef() || useRef();


  const saveNote = async () => {
    const value = await AsyncStorage.getItem("NOTES")
    const n = value ? JSON.parse(value) : []
    n.push({id: v4(), note: note, key: v4(), time: Date.now()})
    await AsyncStorage.setItem("NOTES", JSON.stringify(n))
    .then(() => navigation.navigate(ScreenType.noteList));
    setNote("");
  }

  let renderButton = null;
  if(note !== "") {
    renderButton =  <Button style={styles.button}
    appearance='filled' onPress={saveNote}
    title="Save"
  > SAVE </Button>
  }
  
  return (
    <LinearGradient
        // Background Linear Gradient
        colors={['rgba(60,60,60, 0)', 'rgba(60,60,60, 0.1)']}
        style={styles.gradient}>

    {/* <BlurView intensity={40} tint="light" style={styles.blurContainer}> */}
    <ScrollView style={styles.container} keyboardDismissMode='interactive'>
      <TextInput
        value={note}
        onChangeText={setNote}
        multiline={true}
        autoFocus
        selectionColor='#fff'
        style={[styles.input, darkMode && {color: "white"} ]}
      />

      <KeyboardAvoidingView keyboardVerticalOffset={0} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bottom}> 
        {renderButton}

      </KeyboardAvoidingView>

      {/* <ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}	style={{ flex: 1 }}>
              <RichEditor
                  ref={richText}
                  onChange={ setNote}
              />
              <Button
                style={styles.button}
                appearance='filled' onPress={saveNote}
                title="Save"
              > SAVE </Button>
            </KeyboardAvoidingView>
          </ScrollView>
          <RichToolbar
              editor={richText}
              actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1, ]}
              iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), }}
            /> */}

    </ScrollView>
      {/* </BlurView> */}
    
    </LinearGradient>
  )
}

export default AddNote

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
    paddingBottom: 0,
  },
  button:
  {
    marginBottom: 0,
  },
  gradient: {
    flex: 1,
  },
  input: {
    width: Dimensions.get('window').width,
    minHeight: 340,
  },
  whiteText: {
    color: 'white',
  },
})

AddNote.propTypes = {
  name: PropTypes.bool
};