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


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export async function schedulePushNotification(body, title, dateOfReminder) {

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      // sound: 'default',
    },
    trigger: {
      seconds: 0,
      repeats: false,
      channelId: 'default',
      date: dateOfReminder,
    },
  });
  console.log("notif id on scheduling",id)
  return id;
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
export default function NotificationScreen({ route }) {
  //note info
  const [noteBody, setNoteBody] = useState();
  const [noteId, setNoteId] = useState(route.params.id);
  const [title, setTitle] = useState('Note Reminder');

  //notification 
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  //date picker
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const handleScheduling = () => {
    schedulePushNotification(noteBody, title, selectedDate)
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




  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: 20,
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Choose the notification title:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          maxLength={20} 
        />
        <DateTimePickerModal
          // textColor="white"
          date={selectedDate}
          isVisible={datePickerVisible}
          minimumDate={new Date()}
          maximumDate={maxDate}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          onChange={handleDateChange}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, }}>
          {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
        </Text>
        <Button title="Select a date" onPress={showDatePicker} />
        <Button title="Schedule" onPress={handleScheduling} />
        
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    width: 200,
  },
});
