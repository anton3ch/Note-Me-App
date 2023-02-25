import { StyleSheet, View, Image, Text } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScreenType } from '../constants/constants';







const Header = (props) => {
  return (
    <View style={styles.header} >
      {/* <Ionicons name='list' style={styles.icons}
      onPress={() => props.onScreenChange(ScreenType.noteList)}
      /> */}

      <Text style={styles.text}>Note Me</Text>

      {/* <Ionicons name='add'  style={styles.icons}
      onPress={() => props.onScreenChange(ScreenType.addNote)}
      /> */}

    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    // flex: 1,
    flexDirection: 'row',
    width: "100%",
    height: "10%",
    // textAlign: "center",
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    shadowColor: "gray",
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: {width: 0, height: 5},
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
  },

  icons: {
    fontWeight: "bold",
    fontSize: 24,
  },
});