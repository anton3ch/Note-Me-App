import { StyleSheet, View, Animated, TouchableHighlight, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Divider, List, ListItem, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native"
import { SwipeListView } from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import { BlurView } from 'expo-blur';



const NoteList = () => {
  const [notes, setNotes] = useState([]);
  // const navigation = useNavigation();

  const saveNotes = async (data) => {
    await AsyncStorage.setItem("NOTES", JSON.stringify(data))
  }

  useFocusEffect(
    React.useCallback(() => {
      getNotes()
    }, [])
  )

  const getNotes = () => {
    AsyncStorage.getItem("NOTES").then((notes) => setNotes(
      JSON.parse(notes)
    ))
      // console.log(notes)
  }

  const onShare = async (data) => {
    try {
        await Share.share({
          message: `${data}`,
      });
    } catch (error) {
        alert(error.message);
    }
  };

  const closeRow = (rowMap, itemId) => {
    if(rowMap[itemId]) {
      rowMap[itemId].closeRow()
    }
  }

  const deleteRow = (rowMap, itemId) => {
    closeRow(rowMap, itemId);
    const filteredNotes = notes.filter(item => item.id !== itemId);
    setNotes(filteredNotes);
    saveNotes(filteredNotes);
  }



  const onLeftActionStatusChange = rowKey => {
    console.log('onLeftActionStatusChange', rowKey);
  };

  const onRightActionStatusChange = rowKey => {
    console.log('onRightActionStatusChange', rowKey);
  };

  const onRightAction = rowKey => {
    console.log('onRightAction', rowKey);
  };

  const onLeftAction = rowKey => {
    console.log('onLeftAction', rowKey);
  };










  const VisibleItem = props => {
    
    const {data,
      rowHeightAnimatedValue, onDelete, rightActionState} = props;
      console.log("rightActionState", rightActionState);
    if (rightActionState) {
      onDelete();
      console.log("rightActionState");
      Animated.timing(rowHeightAnimatedValue, {
        toValue: 0,
        duration: 0,
        // useNativeDriver: false,
      });
    }

    return (
      <Animated.View
        style={[styles.rowFront, {height: rowHeightAnimatedValue}]}>
        <TouchableHighlight style={styles.rowFrontVisible}underlayColor={'#aaa'}>
          <View>
            <Text style={styles.details}>{data.item.note}</Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    )
  }



  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);
    return (
      <View>
        <VisibleItem data={data} rowMap={rowMap} rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRow(rowMap, data.item.id)}
        />
      </View>
    )
  }


  const HiddenItemWithActions = props => {
    const {swipeAnimatedValue, leftActionActivated, rightActionActivated, rowActionAnimatedValue, rowHeightAnimatedValue, onDelete, rightActionState} = props;

    // if (rightActionState) {
    //   onDelete();
    //   console.log("rightActionState");
    //   Animated.timing(rowHeightAnimatedValue, {
    //     toValue: 0,
    //     duration: 0,
    //     useNativeDriver: false,
    //   });
    // }
    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 500,
        // useNativeDriver: false
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        // useNativeDriver: false
      }).start();
    }



    let shareComponent = null;
    if (Sharing.isAvailableAsync()) {
      shareComponent = <TouchableOpacity onPress={() => onShare(props.data.item.note)}
      style={[styles.backRightBtn, styles.backRightBtnLeft]}>
          <Animated.View style={[styles.trash, {
            transform: [
              {
                scale: swipeAnimatedValue.interpolate({
                  inputRange: [-150, -90],
                  outputRange: [1, 0],
                  extrapolate: "clamp",
                })
              }
            ]
          }]}>
          <Ionicons name="share-outline" size={25} color='#fff'/>
        </Animated.View>
      </TouchableOpacity>
    }

    return (
      <Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}]}>
        <Text>Left</Text>
        {shareComponent}

        <Animated.View style={[styles.backRightBtn, styles.backRightBtnRight, {
          flex: 1, width: rowActionAnimatedValue
        }]}>
          <TouchableOpacity  onPress={onDelete}
          style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <Animated.View style={[styles.trash, {
              transform: [
                {
                  scale: swipeAnimatedValue.interpolate({
                    inputRange: [-90, -45],
                    outputRange: [1, 0],
                    extrapolate: "clamp",
                  })
                }
              ]
            }]}>
              <Ionicons name="trash-outline" size={25} color='#fff'/>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

      </Animated.View>
    )
  }

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);
    return (
      <HiddenItemWithActions data={data}
      rowMap={rowMap}
      rowActionAnimatedValue={rowActionAnimatedValue}
      rowHeightAnimatedValue={rowHeightAnimatedValue}
      onDelete={() => deleteRow(rowMap, data.item.id) }
      />
    )
  }

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={['white', 'rgba(60,60,60, 0.1)']}
      style={styles.gradient}>
    <BlurView intensity={40} tint="light" style={styles.blurContainer}>
      <SwipeListView
        data={notes.reverse()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        disableRightSwipe
        leftActivationValue={100}
        rightActivationValue={-200}
        leftActionValue={0}
        rightActionValue={-400}
        onLeftAction={onLeftAction}
        onRightAction={onRightAction}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
        
        />
        </BlurView>
    </LinearGradient>
  )
}

export default NoteList

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    height: '100%',
    borderRadius: "20px",
    backgroundColor: 'rgba(60,60,60, 0.1)',
  },
  item: {
    height: 80,
    borderRadius: "20px",
    margin: 20,
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,

  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#999',
  },

})

