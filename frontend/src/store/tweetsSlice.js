import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { socket } from './sockets';

export const tweets_download = createAsyncThunk('tweets/download', async (subscriptions) => {
	const response = await axios.post('/tweets', { id: subscriptions });
	return response.data.tweets;
});

export const tweet_add = createAsyncThunk('tweets/add', async (tweet) => {
	const response = await axios.post('/tweet', {
		body: tweet.body,
		retweetBody: tweet.retweetId,
		parentTweet: tweet.parentTweet,
		attachment: tweet.attachment,
		type: tweet.type,
	});
	return {
		...response.data.tweet,
		retweetBody: tweet.retweetBody,
		user: tweet.me,
	};
});

export const tweets_update = createAsyncThunk('tweets/update', async ({ id, path }) => {
	console.log('tweetsSlice/tweets_update', { id, path });
	const response = await axios.patch('/tweet', { id, path });
	return response.data.tweet;
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
				state.tweets = [{ ...action.payload }, ...state.tweets];
				socket.emit('new tweet', action.payload.user._id);
			})
			.addCase(tweets_update.fulfilled, (state, action) => {
				const tweet = action.payload;
				state.tweets = state.tweets.map((t) =>
					t._id === tweet._id
						? { ...tweet, user: t.user, retweettedBy: tweet.retweettedBy, likedBy: tweet.likedBy }
						: t,
				);
				socket.emit('new tweet', action.payload.user._id);
			});
	},
});

export const { set_tweets, set_state } = tweetsSlice.actions;
export default tweetsSlice.reducer;
