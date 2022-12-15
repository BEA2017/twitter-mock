import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { socket } from './sockets';

export const tweets_download = createAsyncThunk('tweets/download', async ({ user, request }) => {
	console.log('tweetsSlice/tweets_download');
	const response = await axios.post('/tweets', {
		subscriptionIds: [user._id, ...user.subscriptions.map((s) => s._id)],
		requestType: request.type,
		userId: user._id,
	});
	return { user, request, tweets: response.data.tweets };
});

export const tweet_by_id = createAsyncThunk('tweets/tweetById', async (id) => {
	console.log('tweetsSlice/tweet_by_id');
	const response = await axios.get(`/tweet?id=${id}`);
	return { id, tweet: response.data };
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
		replies: tweet.replies,
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
		cache: {
			//stack: [{path:"", offset},{...}]
			// profiles: {
			// 	username1: {
			// 		FEED: [tweetId1, tweetId2, ...],
			// 		TWEETS: [],
			// 		TWEETS_AND_REPLIES: [],
			// 		LIKES: []
			// 	},
			// 	username2: {..}
			// }
			//selectedTweets: {id1: {tree: [], replies:[]}, id2: {...}, ...}
			statck: [],
			profiles: {},
			selectedTweets: {},
		},
		tweets: {
			//id1: {...}, id2: {...}
		},
		state: 'NEVER',
	},
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(tweets_download.pending, (state, action) => {
				state.state = 'LOADING';
			})
			.addCase(tweets_download.fulfilled, (state, action) => {
				state.state = 'LOADED';
				const newTweets = {};
				action.payload.tweets.forEach((t) => (newTweets[t._id] = t));
				state.tweets = { ...state.tweets, ...newTweets };

				const path = action.payload.request.path;
				const username = path;

				state.cache.profiles = {
					...state.cache.profiles,
					[username]: {
						...state.cache.profiles[username],
						[action.payload.request.type]: Object.keys(newTweets),
					},
				};
			})
			.addCase(tweet_by_id.pending, (state, action) => {
				state.state = 'LOADING';
			})
			.addCase(tweet_by_id.fulfilled, (state, action) => {
				state.state = 'LOADED';
				const newTweets = {};

				[action.payload.tweet.tree, action.payload.tweet.replies].forEach((payload) => {
					payload?.forEach((p) => {
						newTweets[p._id] = p;
					});
				});

				newTweets[action.payload.id] = action.payload.tweet.tweet;

				state.tweets = { ...state.tweets, ...newTweets };

				state.cache.selectedTweets = {
					...state.cache.selectedTweets,
					[action.payload.id]: {
						tweet: action.payload.id,
						tree: action.payload.tweet.tree.map((t) => t._id),
						replies: action.payload.tweet.replies.map((r) => r._id),
					},
				};
			})
			.addCase(tweet_add.fulfilled, (state, action) => {
				if (action.payload.parentTweet) {
					state.tweets = state.tweets.map((t) =>
						t._id == action.payload.parentTweet
							? (t = { ...t, replies: [{ ...action.payload }, ...t.replies] })
							: t,
					);
				}
				state.tweets = [{ ...action.payload }, ...state.tweets];
				socket.emit('new tweet', action.payload.user._id);
			})
			.addCase(tweets_update.fulfilled, (state, action) => {
				const tweet = action.payload;
				state.tweets = state.tweets.map((t) =>
					t._id === tweet._id
						? { ...t, retweettedBy: tweet.retweettedBy, likedBy: tweet.likedBy }
						: t,
				);
				socket.emit('new tweet', action.payload.user._id);
			});
	},
});

export default tweetsSlice.reducer;
