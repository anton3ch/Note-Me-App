import { THEME_CHANGE } from "./constants";
import * as c  from './constants';

export const switchMode = () => {
    return {
      type: THEME_CHANGE,
    };
};

export const deleteNotification = id => ({
  type: c.DELETE_NOTIFICATION,
  id
});


export const addNotification = (notification) => {
  const { notificationId, title, note, id } = notification;
  return {
    type: c.ADD_NOTIFICATION,
    notificationId: notificationId,
    title: title,
    note: note,
    id: id,
  }
}