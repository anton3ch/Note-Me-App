import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useState } from 'react';
import Header from './src/components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenType } from './src/constants/constants';
import AddNote from './src/screens/AddNote';
import HomeScreen from './src/screens/HomeScreen';
import NoteList from './src/screens/NoteList';


export default function App() {
  const [screen, setScreen] = useState(ScreenType.home);
  let content;
  if (screen === ScreenType.addNote) {
    content = <AddNote/>
  } else if (screen === ScreenType.noteList) {
    content = <NoteList/>
  } else if (screen === ScreenType.home) {
    content = <HomeScreen/>
  }
  return (
    <LinearGradient
        // Background Linear Gradient
        colors={['white', 'rgba(60,60,60, 0.1)']}
        style={styles.gradient}>
        <Header style={styles.header}
        onScreenChange={(screen) => {setScreen(screen)}}
        />
      <SafeAreaView style={styles.container}>
        
        {content}
        <StatusBar style="auto" />
        
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(171, 171, 171, 0.1)',
    padding: 30,
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
});
