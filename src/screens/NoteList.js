import { ImageBackground, StyleSheet, View, Animated, TouchableHighlight, TouchableOpacity, StatusBar, Modal, TextInput, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Divider, List, ListItem, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native"
import { SwipeListView } from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import SearchBar from '../components/SearchBar';
import { useSelector } from 'react-redux';
import { VirtualizedScrollView } from 'react-native-virtualized-view';
import Highlighter from 'react-native-highlight-words';

  

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isRender, setIsRender] = useState(false);
  const [modalInputText, setModalInputText] = useState();
  const navigation = useNavigation();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  
  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);

  const [sortNewerFirst, setSortNewerFirst] = useState(true);

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => { return (
        <TouchableHighlight style={styles.sortContainer} onPress={() => {setSortNewerFirst(!sortNewerFirst); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.light);}} underlayColor="rgba(156, 156, 156, 0)"> 
          <View style={styles.sortView}>
            <Ionicons name={sortNewerFirst ? 'arrow-down-circle-outline' : "arrow-up-circle-outline"} style={[styles.sortIcon,  darkMode ? {color: 'rgba(214, 214, 214, 1)'} : {color: 'rgba(61, 61, 61, 1)'} ]}/>
            <Text style={[styles.sortText, darkMode ? {color: 'rgba(214, 214, 214, 1)'} : {color: 'rgba(61, 61, 61, 1)'} ]}>Sort</Text>
          </View>
        </TouchableHighlight>
      )},
    });
  }, [sortNewerFirst, darkMode]);

  useEffect(() => { 
    // reverseData(notes);
    animateElement();
    setDarkMode(mode);
  }, [mode]);


  const animateElement = () => {

    Animated.timing(opacityAnimation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false
    }).start(() => {
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false
      }).start()
    });
  };


  const opacityAnimation = useRef(new Animated.Value(0)).current;



  const opacityStyle = { opacity: opacityAnimation };


  // let richText = React.createRef() || useRef();


  const saveNotes = async (data) => {
    console.log(data, 'dataForSave');
    await AsyncStorage.setItem("NOTES", JSON.stringify(data));
    setNotes(data);
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

  const reverseData = data => {
    if(data !== null){
      if(sortNewerFirst){
      return data.sort((a, b) => {
        const aInt = parseInt(a.time);
        const bInt = parseInt(b.time);
        if (aInt < bInt) return 1;
        if (aInt == bInt) return 0;
        if (aInt > bInt) return -1;
      })
    } else {
      return data.sort((b, a) => {
        const aInt = parseInt(a.time);
        const bInt = parseInt(b.time);
        if (aInt < bInt) return 1;
        if (aInt == bInt) return 0;
        if (aInt > bInt) return -1;
      })
    }
    } else {
      return [];
    }
  };

  const filteredData = (searchPhrase) => {
    
    const newData = notes.filter((item) => {
      if (searchPhrase === "") {
        return item;
      }
      // filter of the name
      if (item.note.toLowerCase().trim().replace(/\s/g, "").includes(searchPhrase.toLowerCase().trim().replace(/\s/g, ""))) {
        return item;
      }
    });
    setFilteredNotes(newData);
  };

  const reverseNotes = reverseData(notes);

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

  const deleteRow = (itemId) => {
    // console.log("oh I;m so activated")
    // closeRow(rowMap, itemId);
    const filteredNotes = notes.filter(item => item.key !== itemId);
    saveNotes(filteredNotes);
  }



  const onLeftActionStatusChange = rowKey => {
    console.log('onLeftActionStatusChange', rowKey);
  };

  const onRightActionStatusChange = rowKey => {
    console.log('onRightActionStatusChange', rowKey);
  };

  // const onRightAction = rowKey => {
  //   console.log('onRightAction', rowKey);
  // };

  const onLeftAction = rowKey => {
    console.log('onLeftAction', rowKey);
  };

  const openNote = note => {
    navigation.navigate('NoteDetail', { ...note });
  };

  const VisibleItem = props => {
    
    const {data,
    rowHeightAnimatedValue, onDelete, rightActionState} = props;
    const note = data.item;
    // console.log(noteId, '__________ itemid' )
    // if (rightActionState) {
    //   onDelete();
    //   console.log("rightActionState");
    //   Animated.timing(rowHeightAnimatedValue, {
    //     toValue: 0,
    //     duration: 0,
    //     // useNativeDriver: false,
    //   });
    // }


    return (

      <Animated.View
        style={[styles.rowFront, {height: rowHeightAnimatedValue}, darkMode && {shadowColor: 'rgba(36, 36, 36, 1)'}]}>
                
        <TouchableHighlight
          style={[styles.rowFrontVisible, darkMode && {backgroundColor: 'rgba(36, 36, 36, 1)',}]}
          underlayColor={darkMode ? 'rgba(20, 20, 20, 1)' : '#ddd' }
          onPress={() => {openNote(note);}} 
        >
          <LinearGradient
        colors={['transparent', 'rgba(100,100,100, 0.2)']}
        style={styles.gradientRow}>
          <View>
            {/* <Text style={[styles.details, darkMode ? {color: 'rgba(162, 162, 162, 1)'}: {color: 'rgba(103, 103, 103, 1)'}]}>{data.item.note}</Text> */}
            <Highlighter style={[styles.details, darkMode ? {color: 'rgba(162, 162, 162, 1)'}: {color: 'rgba(103, 103, 103, 1)'}]}
              highlightStyle={[{backgroundColor: 'rgba(252, 255, 101, 0.49)'}, darkMode && {backgroundColor: 'rgba(131, 131, 131, 0.49)'}]}
              searchWords={[searchPhrase]}
              textToHighlight={data.item.note}
            />
            {/* <RichEditor
                        ref={richText}
                        initialContentHTML={data.item.note}
                        disabled={true}
                        style={{fontSize: 10}}
                        editorStyle={{contentCSSText: 'white'}}
                    /> */}
          </View>
          </LinearGradient>
        </TouchableHighlight>
        
      </Animated.View>
    )
  }



  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);
    return (
      <View>
        <VisibleItem
          data={data}
          rowMap={rowMap}
          rowHeightAnimatedValue={rowHeightAnimatedValue}
          removeRow={() => deleteRow(data.item.key)}
        />
      </View>
    )
  }


  const HiddenItemWithActions = props => {
    const {swipeAnimatedValue, leftActionActivated, rightActionActivated, rowActionAnimatedValue, rowHeightAnimatedValue, onDelete, rightActionState, data} = props;

    if (rightActionActivated) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

      Animated.spring(rowActionAnimatedValue, {
        toValue: 500,
        useNativeDriver: false
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        useNativeDriver: false
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
      <Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}, darkMode && {backgroundColor: 'rgba(36, 36, 36, 0.5)',}]}>
        {/* <Text>Left</Text> */}
        {shareComponent}

        <Animated.View style={[styles.backRightBtn, styles.backRightBtnRight, {
          flex: 1, width: rowActionAnimatedValue
        }]}>
          <TouchableHighlight  onPress={onDelete} 
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
          </TouchableHighlight>
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
      onDelete={() => deleteRow(data.item.key) }
      />
    )
  }

  return (
    
    
        // <ImageBackground source = {require('./../img/bg3.jpg')} style={styles.gradient} >
        // <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        <LinearGradient
        // Background Linear Gradient
        colors={['rgba(60,60,60, 0)', 'rgba(120,120,120, 0.15)']}
        style={styles.gradient}>


          <Animated.View style={[opacityStyle, {flex: 1}]} >
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            clicked={clicked}
            setClicked={setClicked}
            handleSearch={filteredData}
          />
        <SwipeListView
          data={clicked ? filteredNotes :reverseNotes}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          leftActivationValue={100}
          rightActivationValue={-250}
          leftActionValue={0}
          rightActionValue={-300}
          extraData={isRender}
          onRightAction={(item) => deleteRow(item)}
          onLeftAction={onLeftAction}
          onLeftActionStatusChange={onLeftActionStatusChange}
          onRightActionStatusChange={onRightActionStatusChange}
          keyboardShouldPersistTaps='handled'
          style={styles.container}
          

          />
          

          </Animated.View>
      {/*  </BlurView>
       </ImageBackground> */}
    </LinearGradient>
  )
}

export default NoteList

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  gradientRow: {
    flex: 1,
    padding: 10,
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  blurContainer: {
    flex: 1,
  },
  container: {
    paddingTop: 0,
  },
  item: {
    height: 80,
    borderRadius: 20,
    margin: 20,
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 6,
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
    // padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    // width: '99%',
    backgroundColor: 'rgba(156, 156, 156, 0.3)',
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
    backgroundColor: 'rgba(115, 105, 255, 1)',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'rgba(255, 93, 93, 1)',
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
    fontSize: 15,
    // color: '#999',
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTextInput: {
    width: '90%',
    height: 70,
    borderColor: 'grey',
    borderWidth: 1,
    fontSize: 25,
  },
  touchableSave: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  sortIcon: {
    fontSize: 26,
    // flex: 1,
    // width: 33,
    // textAlign: 'center',
  },
  sortText: {
    fontSize: 9,
    paddingRight: 2,
  },
  sortContainer: {
    flex: 1,
    position: 'absolute',
    left: 18,
    // width: 33,
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'column',
  },
  sortView: {
    flex: 1,
    width: 33,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }
})

