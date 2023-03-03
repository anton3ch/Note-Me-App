import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import { Provider, useSelector } from 'react-redux';
import rootReducer from './src/redux-store/store';

import { createStore } from 'redux';
const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <HomeScreen/>
    </Provider>
  );
}


