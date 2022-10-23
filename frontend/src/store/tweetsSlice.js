import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const tweets_download = createAsyncThunk('tweets/download', async () => {
	const response = await axios.get('/tweets');
	return response.data.tweets;
});

export const tweet_add = createAsyncThunk('tweets/add', async (tweet) => {
	const response = await axios.post('/tweet', { body: tweet.body, responseTo: tweet.responseTo });
	return { ...response.data.tweet, user: tweet.me };
});

const tweetsSlice = createSlice({
	name: 'tweetsState',
	initialState: {
		tweets: [],
		state: 'NEVER',
	},
	reducers: {
		set_tweets: (state, action) => {
			state.tweets = action.payload;
		},
		set_state: (state, action) => {
			state.state = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(tweets_download.pending, (state, action) => {
				state.state = 'LOADING';
			})
			.addCase(tweets_download.rejected, (state, action) => {
				state.state = 'ERROR';
			})
			.addCase(tweets_download.fulfilled, (state, action) => {
				state.state = 'LOADED';
				state.tweets = action.payload;
				console.log(action.payload);
			})
			.addCase(tweet_add.fulfilled, (state, action) => {
				state.tweets = [...state.tweets, { ...action.payload }];
			});
	},
});

export const { set_tweets, set_state } = tweetsSlice.actions;
export default tweetsSlice.reducer;
