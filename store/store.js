import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import userInfoReducer from './userInfoSlice';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from "redux-thunk";
import editProfileSlice from './editProfileSlice';



const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  editProfile: editProfileSlice,
})


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);