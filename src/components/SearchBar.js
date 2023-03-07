import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, Keyboard, View, StyleSheet, TextInput, Pressable, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';

const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked, handleSearch}) => {

  const fadeAnim = useRef(new Animated.Value(90)).current;

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
  // useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 100,
  //     duration: 100,
  //     useNativeDriver: true,
  //   }).start();
  // }, [clicked]);

  const onSearch = (text) => {
    setSearchPhrase(text);
    handleSearch(text);
  }
  return (
    <View style={styles.container}>
      <View
        style={
          clicked
            ? [styles.searchBar__clicked, darkMode && {backgroundColor: "rgba(180, 180, 180, 0.7)",}]
            : styles.searchBar__unclicked
        }
      >
        {/* search Icon */}
        <Ionicons name='search-outline' style={[styles.icons, {color: placeholderTextColor}, darkMode && clicked && {color: 'rgba(61, 61, 61, 1)'}]}
        color={clicked ? 'rgba(61, 61, 61, 1)' :'grey'}
        />
        {/* Input field */}
        <TextInput
          style={[styles.input, darkMode && {color: 'white'}, darkMode && clicked && {color: 'rgba(61, 61, 61, 1)'}]}
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
    <TouchableOpacity onPress={() => { onSearch("");Haptics.impactAsync(Haptics.ImpactFeedbackStyle.light); }}>
            <Ionicons name='refresh' style={[styles.icons, darkMode && {color: 'rgba(`161, 161, 161, 1)'}]} color='rgba(61, 61, 61, 1)'
            />
          </TouchableOpacity>
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View>
          <Pressable style={styles.button} onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}>
            <Text style={[styles.buttonText, darkMode && {color: '#d9dbda'}]}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: "center",
    flexDirection: "row",
    width: "100%",

  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: `90%`,
    backgroundColor: "rgba(166, 166, 166, 0.48)",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "74%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  icons: {
    // fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    margin: 10,
  },
  buttonText: {
    fontSize: 18,
  }
});


