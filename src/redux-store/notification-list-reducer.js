import * as c  from './constants';

const reducer = (state = {}, action) => {
  const { notificationId, title, note, id } = action;
  switch (action.type) {
    case c.ADD_NOTIFICATION:
      return Object.assign({}, state, {
        [id]: {
        notificationId: notificationId,
        title: title,
        note: note,
        id: id,
        }
      });
  

      case c.DELETE_NOTIFICATION:
        let newState = { ...state };
        delete newState[id];
        return newState;


      default:
        return state;
    }
};

export default reducer;