import themeReducer from './../../redux-store/reducers.js';
import { createStore } from 'redux';
import rootReducer from './../../redux-store/store.js';


let store = createStore(rootReducer);

describe("rootReducer", () => {

  test('Should return default state if no action type is recognized', () => {
    expect(rootReducer({}, { type: null })).toEqual({
      theme: false
    });
  });
  
  test('Check that initial state of themeReducer matches root reducer', () => {
    expect(store.getState().theme).toEqual(themeReducer(undefined, { type: null }));
  });

  
  test('Check that THEME_CHANGE action works for themeReducer and root reducer', () => {
    const action = {
      type: 'THEME_CHANGE'
    }
    store.dispatch(action);
    expect(store.getState().theme).toEqual(themeReducer(undefined, action));
  });

});