
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';



import NoteList from './NoteList';
import NoteDetail from './NoteDetail';



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from '../../node_modules/expo-blur/build/index';
import { useSelector } from 'react-redux';
import NotificationScreen from './NotificationScreen';


const Stack = createStackNavigator();



export default function NoteListController() {
  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);
  useEffect(() => { 
    setDarkMode(mode);
  }, [mode]);


  return (     
    <Stack.Navigator>
      <Stack.Screen name="NoteList" component={NoteList} options={{
          headerStyle: {
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)',
            borderBottomWidth: 1,
            borderColor:  darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(200, 200, 200, 0.9)',
            shadowColor: "gray",
            shadowOpacity: 0.7,
            shadowRadius: 5,
            shadowOffset: {width: 0, height: 5},
            
          },
          headerTintColor: darkMode ? 'rgba(214, 214, 214, 1)' : 'rgba(61, 61, 61, 1)',
        }}/>
      <Stack.Screen name="NoteDetail" component={NoteDetail} options={{
          headerStyle: {
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)',
            borderBottomWidth: 1,
            borderColor:  darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(200, 200, 200, 0.9)',
            shadowColor: "gray",
            shadowOpacity: 0.9,
            shadowRadius: 7,
            shadowOffset: {width: 0, height: 5},
          },
          headerTintColor: darkMode ? 'rgba(214, 214, 214, 1)' : 'rgba(61, 61, 61, 1)',
        }}
      />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{
          headerStyle: {
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)',
            borderBottomWidth: 1,
            borderColor:  darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(200, 200, 200, 0.9)',
            shadowColor: "gray",
            shadowOpacity: 0.7,
            shadowRadius: 5,
            shadowOffset: {width: 0, height: 5},
            
          },
          headerTintColor: darkMode ? 'rgba(214, 214, 214, 1)' : 'rgba(61, 61, 61, 1)',
        }}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(171, 171, 171, 0.1)',
    // padding: 30,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {

    width: "100%",
    textAlign: "center",

    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  blurContainer: {
    flex: 1,
  },
});
