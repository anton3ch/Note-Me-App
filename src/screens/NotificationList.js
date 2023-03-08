import { ImageBackground, StyleSheet, View, Animated, TouchableHighlight, TouchableOpacity, StatusBar, Modal, TextInput, FlatList, SafeAreaView, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native"
import { SwipeListView } from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import SearchBar from '../components/SearchBar';
import * as actions  from './../redux-store/actions';

import { useSelector, useDispatch } from 'react-redux'; 

import {cancelNotification} from "./NotificationScreen";

  

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isRender, setIsRender] = useState(false);
  const [modalInputText, setModalInputText] = useState();
  const navigation = useNavigation();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  const notificationList = useSelector(state => state.mainNotificationList);
  // console.log(notificationList, '___________________');
  console.log(notifications, '********************');
  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      setNotifications(notificationList);
    }, [notificationList])
  )

  useEffect(() => { 
    setDarkMode(mode);
  }, [mode]);


  // let richText = React.createRef() || useRef();



  // const saveNotes = async (data) => {
  //   console.log(data, 'dataForSave');
  //   await AsyncStorage.setItem("NOTES", JSON.stringify(data));
  //   setNotes(data);
  // }


  // const getNotes = () => {
  //   AsyncStorage.getItem("NOTES").then((notes) => setNotes(
  //     JSON.parse(notes)
  //   ))
  //     // console.log(notes)
  // }

  const reverseData = data => {
    if(data !== null){
      return Object.values(data).sort((a, b) => {
        const aInt = parseInt(a.time);
        const bInt = parseInt(b.time);
        if (aInt < bInt) return 1;
        if (aInt == bInt) return 0;
        if (aInt > bInt) return -1;
      })
    } else {
      return [];
    }
  };

  const filteredData = (searchPhrase) => {
    
    const newData = Object.values(notifications).filter((item) => {
      if (searchPhrase === "") {
        return item;
      }
      // filter of the name
      if (item.note.toLowerCase().trim().replace(/\s/g, "").includes(searchPhrase.toLowerCase().trim().replace(/\s/g, ""))) {
        return item;
      }
    });
    setFilteredNotifications(newData);
  };

  const reversedNotifications = reverseData(notifications);


  const deleteNotification = (itemId) => {
    console.log(itemId, 'itemId(((((((((((((((((((((((')
    cancelNotification(itemId)
    dispatch(actions.deleteNotification(itemId));
  }


  const openNote = note => {
    navigation.navigate('NoteDetail', { ...note });
  };

  const handleModal = () => {
    setModalVisible(!modalVisible);
  }


  return (
    <LinearGradient
      colors={['rgba(60,60,60, 0)', 'rgba(60,60,60, 0.1)']}
      style={styles.gradient}
    >
      <ScrollView 
        style={styles.container} 
        keyboardShouldPersistTaps='handled' 
        keyboardDismissMode='onDrag'
      >
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
          handleSearch={filteredData}
        />


        {Object.values(clicked ? filteredNotifications :reversedNotifications).map((notification) => {
          return <Notification
              note={notification.note}
              notificationId={notification.notificationId}
              title={notification.title}
              date={notification.date}
              id={notification.id}
              key={notification.notificationId}
              darkMode={darkMode}
              handleModal={handleModal}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              deleteNotification={deleteNotification}
            />
        })}
      </ScrollView>
    </LinearGradient>
  )
}

function Notification(props){
  return (
    <React.Fragment>
      <View style={[styles.rowFront, props.darkMode && {backgroundColor: 'rgba(36, 36, 36, 1)', shadowColor: 'rgba(36, 36, 36, 1)' }]}>
      <LinearGradient
        colors={['transparent', 'rgba(100,100,100, 0.2)']}
        style={styles.gradientRow}>

        <View style={[styles.rowFrontVisible]}>
          <Text 
            style={[styles.title, props.darkMode ? {color: 'rgba(162, 162, 162, 1)'}: {color: 'rgba(103, 103, 103, 1)'}]}
            >{props.title} - Scheduled For {props.date}</Text>
          <Text 
            style={[props.darkMode ? {color: 'rgba(162, 162, 162, 1)'}: {color: 'rgba(103, 103, 103, 1)'}]}
            >{props.note}</Text>
        </View>

        <TouchableOpacity 
          style={styles.closeBtn} 
          onPress={() => props.setModalVisible(!props.modalVisible)}
          >
          <Ionicons style={styles.closeIcon} name='close-outline'/>
        </TouchableOpacity>

          </LinearGradient>
      </View>

      <View style={styles.centeredView}> 

        <Modal
          animationType="fade"
          transparent={true}
          visible={props.modalVisible}
        >

          <ConfirmDelete 
            notificationId={props.notificationId} 
            deleteNotification={props.deleteNotification} 
            handleModal={props.handleModal} 
            modalVisible={props.modalVisible}
            setModalVisible={props.setModalVisible}
            />
        </Modal>

      </View>

    </React.Fragment>
  );
}

function ConfirmDelete(props){
  return (
    <React.Fragment>
      <View style={styles.modalView}>
      <View style={styles.modalBoxView}>


      <Text style={styles.modalTitle}>Are you sure you want to cancel the reminder?</Text>
      <View style={styles.modalOptions}>
        <TouchableOpacity  
          onPress={() => {props.setModalVisible(!props.modalVisible); props.deleteNotification(props.notificationId)}}
          >
          <Text style={styles.yesOption}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity  
          onPress={() => {props.setModalVisible(!props.modalVisible);}}
          >
            <Text style={styles.noOption}>No</Text>
        </TouchableOpacity>
          </View>
          </View>
      </View>

    </React.Fragment>
  );
}

export default NotificationList

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 0,
  },
  item: {
    height: 80,
    borderRadius: 20,
    margin: 20,
  },
  rowFront: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    // alignContent: 'center',
    borderRadius: 6,
    height: 70,
    marginHorizontal: 5,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,

  },
  rowFrontVisible: {
    // backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    // paddingTop: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
  modalView: {
    backgroundColor: 'rgba(127,127,127,0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  touchableSave: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeBtn: {
    position: 'absolute',
    right: 10,
  },
  closeIcon : {
    fontSize: 35,
    color: 'rgba(255, 93, 93, 1)',
  },
  closeContainer: {
    position: 'absolute',
    right: 16,
    top: 48,
  },
  centeredView: {
    // backgroundColor: 'rgba(100,100,100, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalBoxView: {
    // flex: 1,
    height: 170,
    width: 350,
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptions: {
    flexDirection: 'row',
  },
  yesOption: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: 90,
    padding: 10,
    margin: 20,
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 5,
  },
  noOption: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: 90,
    padding: 10,
    margin: 20,
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 5,
  },
  gradientRow: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 5,
  },
})

