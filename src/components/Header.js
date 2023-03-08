import { StyleSheet, View, Image, Text, TouchableHighlight } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScreenType } from '../constants/constants';
import { useSelector, useDispatch } from 'react-redux'; 
import { switchMode } from './../redux-store/actions';
import { StatusBar } from 'expo-status-bar';
import Animated, { Transitioning, FadeOut, AnimatedLayout, Transition, FadeIn, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
// import { useHeaderHeight } from '@react-navigation/elements';
// const headerHeight = useHeaderHeight();
import { Header } from '@react-navigation/elements';



const CustomHeader = () => {
  const darkMode = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const handleModeChange = () => {
    dispatch(switchMode());
  }
  let statusBarTheme = 'dark';
  if(darkMode){
    statusBarTheme = 'light';
  }

  const ref = useRef(null);
  const [isDarkMode, setDarkMode] = useState(false);
  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={600} />
      <Transition.Out type="fade" durationMs={600} />
    </Transition.Together>
  )

  const themeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(themeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [darkMode]);
  // style={{
  //   opacity: this.state.fadeAnim, // Binds directly
  //   transform: [{
  //     translateY: this.state.fadeAnim.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
  //     }),
  //   }],
  // }}





  return (


    <Animated.View exiting={FadeOut.delay(1000)} layout={Layout.springify()} style={[styles.header, darkMode && styles.headerDark]} >
      <StatusBar
          animated={true}
          style={statusBarTheme}
        />
      {/* <Ionicons name='list' style={styles.icons}
      onPress={() => props.onScreenChange(ScreenType.noteList)}
      /> */}

      <Text style={[styles.text, darkMode && {color: 'rgba(214, 214, 214, 0.8)'}]}>Note Me</Text>

      {/* <Ionicons name='add'  style={styles.icons}
      onPress={() => props.onScreenChange(ScreenType.addNote)}
      /> */}
      <TouchableHighlight onPress={() => {handleModeChange(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.light);}} accessibilityRole='button' aria-label='change dark mode' underlayColor="rgba(156, 156, 156, 0)">
        <Ionicons name={darkMode ? 'sunny-outline' : "moon-outline"} style={[styles.icons, darkMode && {color: 'rgba(214, 214, 214, 0.8)'}]}
        />
      </TouchableHighlight>

    </Animated.View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
  header: {
    // flex: 1,
    flexDirection: 'row',
    width: "100%",
    height: "9%",
    // textAlign: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    shadowColor: "gray",
    shadowOpacity: 0,
    shadowRadius: 7,
    shadowOffset: {width: 0, height: 5},
  },
  headerDark: {
    // flex: 1,
    flexDirection: 'row',
    width: "100%",
    height: "9%",
    // textAlign: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    shadowColor: "gray",
    shadowOpacity: 0,
    shadowRadius: 7,
    shadowOffset: {width: 0, height: 5},
  },
  text: {
    fontWeight: "bold",
    fontSize: 26,
    color: 'rgba(61, 61, 61, 0.5)',
  },

  icons: {
    fontWeight: "bold",
    fontSize: 26,
    marginRight: 10,
  },
});