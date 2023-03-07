import { combineReducers, createStore } from 'redux';
import themeReducer from './reducers';
import notificationListReducer from './notification-list-reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';




const persistConfig = {
  key: 'redux',
  storage: AsyncStorage
}

const rootReducer = combineReducers({
    theme: themeReducer,
    mainNotificationList: notificationListReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)

export default persistedReducer;

