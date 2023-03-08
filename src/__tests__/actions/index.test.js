import * as actions from './../../redux-store/actions';
import * as c from './../../redux-store/constants.js';

describe('Note Me actions', () => {

  it('switchMode should create TOGGLE_FORM action', () => {
    expect(actions.switchMode()).toEqual({
      type: c.THEME_CHANGE
    });
  });

  it('addNotification should create ADD_NOTIFICATION action', () => {
    expect(actions.addNotification({
      notificationId: '70067d23-ef92-48f1-b962-9fb892fb7bdc',
      title: 'Note reminder',
      note: 'I love redux.',
      id: 1,
      date: '2023-03-08T22:09:16.312Z',
    })).toEqual({
      type: c.ADD_NOTIFICATION,
      notificationId: '70067d23-ef92-48f1-b962-9fb892fb7bdc',
      title: 'Note reminder',
      note: 'I love redux.',
      id: 1,
      date: '2023-03-08T22:09:16.312Z',
    });
  });

});