import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useState } from 'react';
import Header from './src/components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenType } from './src/constants/constants';
import AddNote from './src/screens/AddNote';
import HomeScreen from './src/screens/HomeScreen';
import NoteList from './src/screens/NoteList';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from "@eva-design/eva";
import { default as theme } from './custom-theme.json'; 



import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text } from '@ui-kitten/components';
import Note from './src/screens/Note';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tabs = createBottomTabNavigator();


// const TabNavigator = () => (
//   <Navigator tabBar={props => <TopTabBar {...props} />}>
//     <Screen name='Add Note' component={AddNote}/>
//     <Screen name='Notes' component={NoteList}/>
//     <Screen name='Note' component={Note}/>
//   </Navigator>
// );

// const { Navigator, Screen } = createMaterialTopTabNavigator();

// const TopTabBar = ({ navigation, state }) => (
//   <TabBar
//     selectedIndex={state.index}
//     onSelect={index => navigation.navigate(state.routeNames[index])}>
//     <Tab title='Add Note'/>
//     <Tab title='Notes'/>
//   </TabBar>
// );

export default function App() {
  // const [screen, setScreen] = useState(ScreenType.home);
  // let content;

  // if (screen === ScreenType.addNote) {
  //   content = <AddNote
  //   onScreenChange={(screen) => {setScreen(screen)}}
  //   />
  // } else if (screen === ScreenType.noteList) {
  //   content = <NoteList/>
  // } else if (screen === ScreenType.home) {
  //   content = <HomeScreen/>
  // }

  return (
    
    <LinearGradient
        // Background Linear Gradient
        colors={['white', 'rgba(60,60,60, 0.1)']}
        style={styles.gradient}>
          
        <Header style={styles.header}
        onScreenChange={(screen) => {setScreen(screen)}}
        />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <View style={styles.container}>
      <NavigationContainer>
        {/* <TabNavigator/> */}
        {/* <NoteList/> */}
        <Tabs.Navigator>
      
          <Tabs.Screen name="NoteList" component={NoteList} />
          <Tabs.Screen name="AddNote" component={AddNote} />
        </Tabs.Navigator>
      </NavigationContainer>
        <StatusBar style="auto" />
        
      </View>
      </ApplicationProvider>
    </LinearGradient>
    
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
});
