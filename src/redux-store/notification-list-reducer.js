import * as c  from './constants';

const INITIAL_STATE = {}

const reducer = (state = {}, action) => {
  const { notificationId, title, note, id, date } = action;
  switch (action.type) {
    case c.ADD_NOTIFICATION:
      return Object.assign({}, state, {
        [notificationId]: {
        notificationId: notificationId,
        title: title,
        note: note,
        id: id,
        date: date,
        }
      });
  

      case c.DELETE_NOTIFICATION:
        let newState = { ...state };
        delete newState[id];
        return newState;

      case c.RESET_NOTIFICATION:
        return INITIAL_STATE;

      default:
        return state;
    }
};

export default reducer;