import { configureStore } from '@reduxjs/toolkit';
import tweetsReducer from './tweetsSlice';
import userReducer from './userSlice';

export const store = configureStore({
	reducer: { tweets: tweetsReducer, users: userReducer },
});
