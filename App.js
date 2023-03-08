import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StyleSheet, Text, View } from 'react-native';
import {store, persistor} from './src/redux-store/store';



export default function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
          <HomeScreen />
      </PersistGate>
    </Provider>
  );
}