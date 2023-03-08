import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, Button, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native'
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
import {useWindowDimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';

// import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";

const AddNote = () => {
  const [note, setNote] = useState('');
  const navigation = useNavigation();

  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);
  const {height} = useWindowDimensions();


  useEffect(() => { 
    setDarkMode(mode);
  }, [mode]);
  // let richText = React.createRef() || useRef();


  React.useEffect(() => {
    if(note !== "") {
    navigation.setOptions({
      headerRight: () => { return (
        <TouchableOpacity style={styles.saveContainer} onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.light); saveNote();}}>
          <Ionicons name="save-outline" style={[styles.saveIcon,  darkMode ? {color: 'rgba(214, 214, 214, 1)'} : {color: 'rgba(61, 61, 61, 1)'} ]} /><Text style={[styles.saveText, darkMode ? {color: 'rgba(214, 214, 214, 1)'} : {color: 'rgba(61, 61, 61, 1)'} ]}>Save</Text>
        </TouchableOpacity>
      )},
    });
    } else {
      navigation.setOptions({
        headerRight: () => { return (
          <TouchableOpacity />
        )},
      });
    }
  }, [darkMode, note]);

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
    renderButton =  <TouchableHighlight style={styles.button}>
    <Text style={styles.button} onPress={saveNote}
    > SAVE </Text>
    </TouchableHighlight>
  }
  
  return (
    <LinearGradient
        // Background Linear Gradient
        colors={['rgba(60,60,60, 0)', 'rgba(60,60,60, 0.1)']}
        style={styles.gradient}>

    {/* <BlurView intensity={40} tint="light" style={styles.blurContainer}> */}
    {/* <View style={styles.gradient}> */}

    <ScrollView style={[styles.container, {height: height /100 * 70}]} keyboardDismissMode='onDrag'>


      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={height / 100 * 14} style={{flex: 1, height: height /100 * 80}}> 
        <TextInput
          value={note}
          onChangeText={setNote}
          multiline={true}
          autoFocus
          selectionColor={darkMode ? '#fff' : 'rgba(74, 74, 74, 0.8)'}
          style={[styles.input, darkMode && {color: "white"} ]}
          />
          {/* {renderButton} */}
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
          {/* </View> */}
      {/* </BlurView> */}
    
    </LinearGradient>
  )
}

export default AddNote

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    // padding: 30,
    // paddingTop: 80,
    // height: Dimensions.get('window').height,
    // backgroundColor: 'rgba(171, 171, 171, 0.1)'
  },
  blurContainer: {
    flex: 1,
  },
  bottom:
  {
    flex: 1,
    // justifyContent: 'flex-end',
    // paddingBottom: 0,
  },
  button:
  {
    position: 'absolute',
    bottom: 5,
    // marginBottom: 0,
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
  whiteText: {
    color: 'white',
  },
  saveText: {
    fontSize: 9,
  },
  saveContainer: {
    flex: 1,
    position: 'absolute',
    left: 11,
    width: 39,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  saveIcon: {
    fontSize: 24,
    paddingBottom: 2,
  },
})

AddNote.propTypes = {
  name: PropTypes.bool
};