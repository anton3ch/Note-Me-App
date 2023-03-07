import notificationListReducer from './../../redux-store/notification-list-reducer.js';
import themeReducer from './../../redux-store/reducers.js';

import { createStore } from 'redux';
import rootReducer from './../../redux-store/store.js';
import * as c from './../../redux-store/constants';


let store = createStore(rootReducer);

describe("rootReducer", () => {

  test('Should return default state if no action type is recognized', () => {
    expect(rootReducer({}, { type: null })).toEqual({
      theme: false,
      mainNotificationList: {},
    });
  });
  
  test('Check that initial state of themeReducer matches root reducer', () => {
    expect(store.getState().theme).toEqual(themeReducer(undefined, { type: null }));
  });

  test('Check that initial state of notificationListReducer matches root reducer', () => {
    expect(store.getState().mainNotificationList).toEqual(notificationListReducer(undefined, { type: null }));
  });

  
  test('Check that THEME_CHANGE action works for themeReducer and root reducer', () => {
    const action = {
      type: 'THEME_CHANGE'
    }
    store.dispatch(action);
    expect(store.getState().theme).toEqual(themeReducer(undefined, action));
  });

  test('Check that ADD_NOTIFICATION action works for notificationListReducer and root reducer', () => {
    const action = {
      type: c.ADD_NOTIFICATION,
      notificationId: '70067d23-ef92-48f1-b962-9fb892fb7bdc',
      title: 'Note reminder',
      note: 'I love redux.',
      id: 1 
    }
    
    store.dispatch(action);
    expect(store.getState().mainNotificationList).toEqual(notificationListReducer(undefined, action));
  });

});