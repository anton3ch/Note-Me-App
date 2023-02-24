import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Divider, List, ListItem, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native"


export default function Note({route}) {
  const [notes, setNotes] = useState([]);
  const {singleNote} = route.params;
  const navigation = useNavigation();


  useFocusEffect(
    React.useCallback(() => {
      getNotes()
    }, [])
  )

  const getNotes = () => {
    AsyncStorage.getItem("NOTES").then((notes) => setNotes(JSON.parse(notes)))
  }
  
  const deleteNote = async () => {
    const newNotes = await notes.filter((note) => note !== singleNote)
    await AsyncStorage.setItem("NOTES", JSON.stringify(newNotes)).then(() => navigation.navigate("AllNotes"))
  }

  return (
    <LinearGradient
        // Background Linear Gradient
        colors={['white', 'rgba(60,60,60, 0.5)']}
        style={styles.gradient}>
    <View>
      <Text category='h1'>
        Notes
      </Text>
      <Text>
        {singleNote}
      </Text>
    </View>
    <View>
      <Button onPress={deleteNote}>Delete</Button>
    </View>
    </LinearGradient>
  )
}



const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    height: '100%',
    borderRadius: "20px",
    backgroundColor: 'rgba(60,60,60, 0.1)',
  },
  item: {
    height: 80,
    borderRadius: "20px",
    margin: 20,
  }
})