import * as c from './../../redux-store/constants';
import notificationListReducer from './../../redux-store/notification-list-reducer.js';


describe('notificationListReducer', () => {

  const currentState = {
    1: {
      notificationId: '70067d23-ef92-48f1-b962-9fb892fb7bdc',
      title: 'Note reminder',
      note: 'I love redux.',
      id: 1,
      date: '2023-03-08T22:09:16.312Z',
    }, 2: {
      notificationId: '40af29ee-7aed-434b-bbe6-e7fb6eb5e5ec',
      title: 'Note reminder',
      note: 'Reducer has side effects.',
      id: 2,
      date: '2023-03-08T22:09:16.312Z',
    }
  }

  let action;

  const notificationData = {
    notificationId: '70067d23-ef92-48f1-b962-9fb892fb7bdc',
    title: 'Note reminder',
    note: 'I love redux.',
    id: 1,
    date: '2023-03-08T22:09:16.312Z',
  };


  test('Should return default state if there is no action type passed into the reducer', () => {
    expect(notificationListReducer({}, { type: null })).toEqual({});
  });

  test('should successfully add a notification to the notification list', () => {
    const { notificationId, title, note, id, date } = notificationData;
    action = {
      type: c.ADD_NOTIFICATION,
      notificationId: notificationId,
      title: title,
      note: note,
      id: id,
      date: date,
    };
    expect(notificationListReducer({}, action)).toEqual({
      [id] : {
        notificationId: notificationId,
        title: title,
        note: note,
        id: id,
        date: date,
      }
    });
  });

  test('Should successfully delete a notification', () => {
    action = {
      type: 'DELETE_NOTIFICATION',
      id: 1
    };
    expect(notificationListReducer(currentState, action)).toEqual({
      2: {
        notificationId: '40af29ee-7aed-434b-bbe6-e7fb6eb5e5ec',
        title: 'Note reminder',
        note: 'Reducer has side effects.',
        id: 2,
        date: '2023-03-08T22:09:16.312Z',
      }
    });
  });
  
  // test('Should add a formatted wait time to ticket entry', () => {
  //   const { names, location, issue, timeOpen, id } = notificationData;
  //   action = {
  //     type: c.UPDATE_TIME,
  //     formattedWaitTime: '4 minutes ago',
  //     id: id
  //   };
  //   expect(ticketListReducer({ [id] : notificationData }, action)).toEqual({
  //     [id] : {
  //       names: names,
  //       location: location,
  //       issue: issue,
  //       timeOpen: timeOpen,
  //       id: id,
  //       formattedWaitTime: '4 minutes ago'
  //     }
  //   });
  // });

  // it('updateTime should create UPDATE_TIME action', () => {
  //   expect(actions.updateTime(1, 'less than a minute ago')).toEqual({
  //     type: c.UPDATE_TIME,
  //     id: 1,
  //     formattedWaitTime: 'less than a minute ago'
  //   });
  // });

  
});