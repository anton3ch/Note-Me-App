import { ImageBackground, StyleSheet, View, SafeAreaView, Appearance, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from './../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenType } from './../constants/constants';
import AddNote from './../screens/AddNote';

import NoteList from './NoteList';
import NoteListController from './NoteListController';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from "@eva-design/eva";
// import { default as theme } from './custom-theme.json';
import { BlurView } from 'expo-blur';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { switchMode } from './../redux-store/actions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';











const Tabs = createBottomTabNavigator();



export default function HomeScreen() {
  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);
  const [background, setBackground] = useState({uri: require('./../img/bg4.jpg')});
  const [darkBackground, setDarkBackground] = useState({uri: require('./../img/bg-dark.jpg')});

  const dispatch = useDispatch();
  const handleModeChange = () => {
    dispatch(switchMode());
  }

  useEffect(() => { 
    animateElement();
    setDarkMode(mode);
    
  }, [mode]);

  console.log(Appearance.getColorScheme())


  Appearance.addChangeListener(({ colorScheme }) => {
    if(colorScheme === 'dark' && mode === 'light'){
      handleModeChange();
    } else if (colorScheme === 'light' && mode === 'dark'){
      handleModeChange();
    }
  });

  const theme = {
    colors: {
      primary: darkMode ? 'white' : 'grey',
      background: "transparent",
      text: darkMode ? 'white' : 'grey' ,
    },
  };

  const animateElement = () => {

    Animated.timing(opacityAnimation, {
      toValue: 0,
      duration: 5,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }).start()
    })
  };



  const opacityAnimation = useRef(new Animated.Value(0)).current;


  const opacityStyle = { opacity: opacityAnimation };





  return (
    <View style={[{flex:1,backgroundColor: 'rgba(75, 75, 75, 1)' }, darkMode && {backgroundColor: 'rgba(226, 226, 226, 1)'}]}>

    <Animated.View style={[styles.box, opacityStyle]}>
      <ImageBackground source = {darkMode ? darkBackground.uri : background.uri } style={styles.gradient} >

        <BlurView intensity={20} tint="light" style={styles.blurContainer}>

        <Header />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          <View style={styles.container}>
            <NavigationContainer theme={theme}>
              <Tabs.Navigator>

                <Tabs.Screen name="Note List" component={NoteListController} options={{headerShown: false}} />
                <Tabs.Screen name="Add Note" component={AddNote} 
                  options={{
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
                  }}
                />

              </Tabs.Navigator>
            </NavigationContainer>


          </View>
        </ApplicationProvider>

        </BlurView>
      </ImageBackground>
    </Animated.View>
    </View>
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
    // opacity: 0,
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
  box: {
    flex: 1,
    backgroundColor: 'black',
    // opacity: 1,
  },
});

