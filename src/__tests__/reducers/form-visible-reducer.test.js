import themeReducer from './../../redux-store/reducers.js';

describe("formVisibleReducer", () => {

  test('Should return default state if no action type is recognized', () => {
    expect(themeReducer(false, { type: null })).toEqual(false);
  });

  test('Should toggle darkMode state to true', () => {
    expect(themeReducer(false, { type: 'THEME_CHANGE' })).toEqual(true);
  });

});
