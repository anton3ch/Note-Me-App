import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, Keyboard, View, StyleSheet, TextInput, Pressable, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import {useWindowDimensions} from 'react-native';

const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked, handleSearch}) => {

  const {width} = useWindowDimensions();
  const [searchBarWidth, setSearchBarWidth] = useState(new Animated.Value(width / 100 * 90));
  const [bgColor, setBgColor] = useState(new Animated.Value(1));
  const [opacityAnimation, setOpacityAnimation] = useState(new Animated.Value(0));

  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);

  useEffect(() => { 
    setDarkMode(mode);
  }, [mode]);

  let placeholderTextColor;
  if (darkMode && !clicked) {
    placeholderTextColor='rgba(208, 208, 208, 1)'
  } else if (!darkMode && !clicked) {
      placeholderTextColor='rgba(98, 98, 98, 1)'
  }

  const onSearch = (text) => {
    setSearchPhrase(text);
    handleSearch(text);
  }

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


  useEffect(() => {
    const newWidth = clicked ? width / 100 * 78 : width / 100 * 90;
    Animated.timing(searchBarWidth, {
      toValue: newWidth,
      duration: 600,
      useNativeDriver: false,
    }).start();
    const newColor = clicked ? 1 : 0;
    Animated.timing(bgColor, {
      toValue: newColor,
      duration: 600,
      useNativeDriver: false,
    }).start();
    const newOpacity = clicked ? 1 : 0;
    Animated.timing(opacityAnimation, {
      toValue: newOpacity,
      duration: 600,
      useNativeDriver: true
    }).start()

  }, [clicked]);

  const opacityStyle = { opacity: opacityAnimation };

  const bgStyle = {
    backgroundColor: bgColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(166, 166, 166, 0.48)", "rgba(255, 255, 255, 0.7)"],
    }),
  };

  // const iconColor = {
  //   backgroundColor: bgColor.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: ["rgba(166, 166, 166, 0.48)", "rgba(255, 255, 255, 0.7)"],
  //   }),
  // };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        setClicked(!clicked);
      }}>
        <Animated.View
          style={[
            styles.searchBar__unclicked,
            {
              width: searchBarWidth,
              marginLeft: width / 100 * 5,
              // backgroundColor: clicked ? "rgba(255, 255, 255, 0.7)" : "rgba(166, 166, 166, 0.48)",
            },
            bgStyle,
            // darkMode && clicked && { backgroundColor: "rgba(180, 180, 180, 0.7)" },
          ]}
        >
          {/* search Icon */}
          <Ionicons
            name="search-outline"
            style={[
              styles.icons,
              { color: placeholderTextColor },
              darkMode && clicked && { color: 'rgba(61, 61, 61, 1)' },
            ]}
            color={clicked ? 'rgba(61, 61, 61, 1)' : 'grey'}
          />
          {/* Input field */}
          <TextInput
            style={[
              styles.input,
              darkMode && { color: 'white' },
              darkMode && clicked && { color: 'rgba(61, 61, 61, 1)' },
            ]}
            placeholder="Search"
            placeholderTextColor={placeholderTextColor}
            value={searchPhrase}
            onChangeText={(text) => onSearch(text)}
            onFocus={() => {
              onSearch('');
              setClicked(true);
            }}
          />
          {/* cross Icon, depending on whether the search bar is clicked or not */}

          {clicked && (
            <Animated.View style={opacityStyle}>
              <TouchableOpacity onPress={() => { onSearch("");Haptics.impactAsync(Haptics.ImpactFeedbackStyle.light); }} >
                <Ionicons
                  name="refresh"
                  style={[styles.icons, darkMode && { color: 'rgba(`161, 161, 161, 1)' }]}
                  color="rgba(61, 61, 61, 1)"
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <Animated.View style={opacityStyle}>
          <Pressable style={styles.button} onPress={() => {
              onSearch("");
              Keyboard.dismiss();
              setClicked(false);
            }}>
            <Text style={[styles.buttonText, darkMode && {color: '#d9dbda'}]}>Cancel</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: "row",
    width: "100%",


  },
  searchBar__unclicked: {
    padding: 8,
    flexDirection: "row",
    // width: `90%`,
    // backgroundColor: "rgba(166, 166, 166, 0.48)",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 8,
    flexDirection: "row",
    // width: "74%",
    // backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "85%",
  },
  icons: {
    // fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    margin: 8,
  },
  buttonText: {
    fontSize: 18,
  }
});


