import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native'
import React, { useState, Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenType } from '../constants/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { v4 } from 'uuid';
import {Dimensions} from 'react-native';
import { VibrancyView } from "@react-native-community/blur/";
import { BlurView } from 'expo-blur';
import { useNavigation } from "@react-navigation/native"

const AddNote = (props) => {
  const [note, setNote] = useState();
  const navigation = useNavigation();

  const saveNote = async () => {
    const value = await AsyncStorage.getItem("NOTES")
    const n = value ? JSON.parse(value) : []
    n.push({id: v4(), note: note, key: v4(), time: Date.now()})
    await AsyncStorage.setItem("NOTES", JSON.stringify(n))
    .then(() => navigation.navigate(ScreenType.noteList));
    setNote("")
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
      onChangeText={setNote}
      multiline={true}
      autoFocus
      selectionColor='#fff'
      style={styles.input}
      />
      <KeyboardAvoidingView keyboardVerticalOffset={150} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bottom}> 
        <Button
        style={styles.button}
        appearance='filled' onPress={saveNote}
        title="Save"
        > SAVE </Button>
      </KeyboardAvoidingView>
    </ScrollView>
      </BlurView>
    
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