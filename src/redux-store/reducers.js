import { THEME_CHANGE } from './constants';

const themeReducer = (state = false, action) => {
  switch (action.type) {
  case THEME_CHANGE:
    return !state;
  default:
    return state;
  }
};

export default themeReducer;