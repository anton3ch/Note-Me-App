import { ImageBackground, StyleSheet, View, SafeAreaView, Appearance, Animated, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from './../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenType } from './../constants/constants';
import AddNote from './../screens/AddNote';

import NoteList from './NoteList';
import NoteListController from './NoteListController';
import * as eva from "@eva-design/eva";
// import { default as theme } from './custom-theme.json';
import { BlurView } from 'expo-blur';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { switchMode } from './../redux-store/actions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Notifications } from 'expo';
import NotificationList from './NotificationList';
import Ionicons from 'react-native-vector-icons/Ionicons';




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
      duration: 0,
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

          <View style={styles.container}>
            <NavigationContainer theme={theme}>
              <Tabs.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  size = 28;
                  if (route.name === 'Add Note') {
                    iconName = focused
                      ? 'add'
                      : 'add-outline';
                  } else if (route.name === 'Notes') {
                    iconName = focused ? 'list' : 'list-outline';
                  } else if (route.name === 'Note Reminders') {
                    iconName = focused ? 'alarm' : 'alarm-outline';
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: darkMode ? 'tomato' : 'rgba(85, 56, 255, 1)',
                tabBarInactiveTintColor: darkMode ? 'rgba(214, 214, 214, 1)' : 'rgba(61, 61, 61, 1)',
                // tabStyle: {
                //   borderWidth: 10,
                //   borderRightColor: '#ddd',
                // },
                // style: { borderWidth: 10,},
                tabBarStyle: {
                  // backgroundColor:'rgba(127, 127, 127, 0.8)',
                  borderTopColor: 'black',
                  // borderColor: 'red',
                  // borderLeftWidth: '1px',
                  shadowOffset: {
                      width: 5, height: 0 // for iOS
                },
              
              }
              })}
            >


                <Tabs.Screen name="Notes" component={NoteListController} options={{headerShown: false}} />
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
                    headerRight: () => { return(
                      <Ionicons/>
                    )},
                    headerTintColor: darkMode ? 'rgba(214, 214, 214, 1)' : 'rgba(61, 61, 61, 1)',
                    headerTitleStyle: {
                      fontSize: 20,
                    },
                  //   tabBarOptions: {
                  //     style: {
                  //         borderTopWidth: 0,
                  //         borderLeftWidth: 10,
                  //         backgroundColor: '#FFFFFF',
                  //         borderTopRightRadius: 20,
                  //         borderTopLeftRadius: 20,
                  //         height: 55,
                  //         paddingBottom: 5,
                  //     }
                  // },

                  }}
                />
                  <Tabs.Screen name="Note Reminders" component={NotificationList} options={{
                    headerStyle: {
                      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)',
                      borderBottomWidth: 1,
                      borderColor:  darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(200, 200, 200, 0.9)',
                      shadowColor: "gray",
                      shadowOpacity: 0.7,
                      shadowRadius: 5,
                      shadowOffset: {width: 0, height: 5},
                      
                    },
                    headerTitleStyle: {
                      fontSize: 20,
                    },
                    headerTintColor: darkMode ? 'rgba(214, 214, 214, 1)' : 'rgba(61, 61, 61, 1)',
                  }}/>
              </Tabs.Navigator>
            </NavigationContainer>


          </View>
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

