
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';



import NoteList from './NoteList';
import NoteDetail from './NoteDetail';



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();



export default function App() {

  return (
    

          
          <Stack.Navigator>
            <Stack.Screen name="NoteList" component={NoteList} />
            <Stack.Screen name="NoteDetail" component={NoteDetail} />
          </Stack.Navigator>

    
  );
}