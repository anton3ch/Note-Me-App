import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from "@react-navigation/native"
/////
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
// import React, { useState, useEffect, useRef } from "react";
import {  Platform } from "react-native";
import * as Device from 'expo-device';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions  from './../redux-store/actions';
import { useSelector, useDispatch } from 'react-redux'; 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export async function schedulePushNotification(body, title, dateOfReminder, noteId) {

  if(title === '') {
    title = "⏰ Note Me ⏰"
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body.replaceAll(/\n\s*\n/g, '\n').replaceAll(/[^\S\n]+(?![^\S\n])/g, ' ').trim(),
      data: { noteId },
      // sound: 'default',
    },
    trigger: {
      seconds: 2,
      repeats: false,
      channelId: 'default',
      // date: dateOfReminder,
    },
  });
  // console.log("notif id on scheduling",id)

  return id
}



const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return alert('Please allow notifications in ios Settings > Notifications > Note App.');
  }
};


export async function cancelNotification(notifId){
  await Notifications.cancelScheduledNotificationAsync(notifId);
}

////////////////////////////////////////////////////////
export default function NotificationScreen(props) {
  const mode = useSelector(state => state.theme);
  const [darkMode, setDarkMode] = useState(mode);
  //note info
  const [noteBody, setNoteBody] = useState();
  const [noteId, setNoteId] = useState(props.noteId);
  // const [title, setTitle] = useState('Note Reminder');
  const [title, setTitle] = useState('');


  //notification 
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  //date picker
  const [selectedDate, setSelectedDate] = useState();
  const [timeOfSelection, setTimeOfSelection] = useState(0);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  
  // get the current date & time (as milliseconds since Epoch)
  const currentTimeAsMs = Date.now();
  // Add 30 days to the current date & time
  const adjustedTimeAsMs = currentTimeAsMs + (1000 * 60 * 60 * 24 * 31);
  const addFiveMin = currentTimeAsMs + (1000 * 60 * 5);
  // create a new Date object, using the adjusted time
  const maxDate = new Date(adjustedTimeAsMs);
  const minDate = new Date(addFiveMin);



  const dispatch = useDispatch();


  // console.log(selectedDate.getTime(), 'selectedDate.getTime()', selectedDate);
  // console.log(Date.now(), 'Date.now()', new Date(Date.now()));
  // console.log(minutes, 'minutes');
  //date picker functions

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const time = Date.now();
    setTimeOfSelection(time);
  };

  //notification handling



  useEffect(() => {
    registerForPushNotificationsAsync()
    // .then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response, 'response');
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleScheduling = async () => {
    let NotificationTitle;
    const notifDate = format(selectedDate, 'MMMM dd, yyyy hh:mma');

    if(title === '') {
      NotificationTitle = "⏰ Note Me ⏰"
    } else {
      NotificationTitle = title;
    }
    const id = await schedulePushNotification(noteBody, NotificationTitle, selectedDate, noteId);
    let newNotification = {
      notificationId: id, 
      title: NotificationTitle, 
      note: noteBody, 
      id:  noteId,
      date: notifDate,
    };
    dispatch(actions.addNotification(newNotification));
    // dispatch(actions.resetNotification());

  }


  //look up note
  const handleEditItem = async (noteId) => {
    const result = await AsyncStorage.getItem('NOTES');

    let notes = [];
    if (result !== null) notes = JSON.parse(result);
    let selectedNote;
    notes.filter(item => {
      if (item.id === noteId) {
        return selectedNote = item.note;
      }
    })
    setNoteBody(selectedNote);
  }
  handleEditItem(noteId);

  const navigation = useNavigation();

  let scheduleButton;
  if(selectedDate){
    scheduleButton = <View style={styles.scheduleButton}><Button title="Schedule" onPress={()=>{handleScheduling(), props.handleModal()}} /></View>
  }



  return (
    <View style={[{flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)', }, darkMode && {backgroundColor: 'rgba(60, 60, 60, 0.9)'}]}>
      <View
        style={{
          padding: 20,
          flex: 1,
          height: 100,
          // display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={[{fontSize: 18}, darkMode && {color: 'white'}]}>Choose the notification title:</Text>
        <TextInput
          style={[styles.textInput, darkMode && {color: 'white'}]}
          placeholder="My custom note reminder"
          // value={title}
          onChangeText={(text) => setTitle(text)}
          maxLength={33} 
          placeholderTextColor={darkMode ? "rgba(230, 230, 230, 0.8)" : "rgba(100, 100, 100, 0.8)" }
        />
        <DateTimePickerModal
          textColor={darkMode ? "black": 'black'}
          themeVariant={darkMode ? "dark": 'light'}
          // style={{backgroundColor: 'rgba(200,200,200,0.5)',}} 
          date={selectedDate}
          isVisible={datePickerVisible}
          minimumDate={new Date()}
          maximumDate={maxDate}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          onChange={handleDateChange}
        />
        <Text style={[styles.date, { fontSize: 24, marginBottom: 20, }, darkMode && {color: 'white', borderColor: 'gray',}]} onPress={()=>{showDatePicker(); setSelectedDate(new Date())}}>
          {selectedDate ? selectedDate.toLocaleString('en-US', {dateStyle: "full", timeStyle: 'short'}) : 'Select a date'}
        </Text>
        {/* <Button title={selectedDate ? 'Change date' : ""} onPress={()=>{showDatePicker(); setSelectedDate(new Date())}} /> */}
        {scheduleButton}
        
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'rgba(200,200,200,0.5)',
    padding: 10,
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
    width: 250,
    borderRadius: 5,
    fontSize: 16,
  },
  scheduleButton: {
    position: 'absolute',
    bottom: 350,
  },
  date: {
    // shadowColor: 'white',
    // shadowOffset:  {width: 0 ,height: 0},
    // shadowOpacity: 1,
    // shadowRadius: 5,
    borderColor: 'gray',
    // backgroundColor: 'black',
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderStyle: 'dashed',

  },
});
