import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { socket } from './sockets';

export const tweets_download = createAsyncThunk('tweets/download', async ({ user, request }) => {
	// console.log('tweetsSlice/tweets_download');
	const response = await axios.post('/tweets', {
		subscriptionIds: [user._id, ...user.subscriptions.map((s) => s._id || s)],
		requestType: request.type,
		userId: user._id,
	});
	return { user, request, tweets: response.data.tweets, retwitted: response.data.retwitted };
});

export const tweet_by_id = createAsyncThunk('tweets/tweetById', async (id) => {
	// console.log('tweetsSlice/tweet_by_id');
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
	const retwittedUser = tweet.type === 'Retweet' ? tweet.retweetBody.user : undefined;
	return {
		...response.data.tweet,
		_user: tweet.me.login,
		retwittedUser,
	};
});

export const tweets_update = createAsyncThunk('tweets/update', async ({ id, path, me }) => {
	console.log('tweetsSlice/tweets_update', { id, path });
	const response = await axios.patch('/tweet', { id, path });
	return { id, path, updated: response.data.updated, me };
});

export const tweets_search = createAsyncThunk(
	'tweets/search',
	async ({ searchQuery, searchType }) => {
		console.log('tweetsSlice/tweets_search');
		const response = await axios.post('/search', { searchQuery, searchType });
		return { result: response.data.result };
	},
);

const tweetsSlice = createSlice({
	name: 'tweetsState',
	initialState: {
		cache: {
			//stack: [{path:"", offset},{...}]
			// profiles: {
			// 	/username1: {
			// 		FEED: [tweetId1, tweetId2, ...],
			// 		TWEETS: [],
			// 		TWEETS_AND_REPLIES: [],
			// 		LIKES: []
			// 	},
			// 	/username2: {..}
			// }
			//selectedTweets: {id1: {tree: [], replies:[]}, id2: {...}, ...}
			statck: [],
			profiles: {},
			selectedTweets: {},
		},
		tweets: {
			//id1: {...}, id2: {...}
		},
		searchResults: [
			//tweetId1, tweetId2...
		],
		state: 'NEVER',
	},
	reducers: {
		set_tweets_state: (state, action) => {
			state.state = action.payload;
		},
		clear_search_results: (state, action) => {
			state.searchResults = [];
			state.state = 'PENDING';
		},
		refresh_feed: (state, action) => {
			console.log('tweetsSlice/refresh_feed', action.payload.username);
			const username = action.payload.username;
			delete state.cache.profiles[`/${username}`]?.FEED;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(tweets_download.pending, (state, action) => {
				state.state = 'LOADING';
			})
			.addCase(tweets_download.fulfilled, (state, action) => {
				// console.log('tweetsSlice/tweets_download', action.payload);
				state.state = 'LOADED';
				const tweets = action.payload.tweets;
				const retwitted = action.payload.retwitted;
				const tweetsWithRetweets = {};
				tweets.concat(...retwitted).forEach((t) => (tweetsWithRetweets[t._id] = t));
				state.tweets = { ...state.tweets, ...tweetsWithRetweets };

				const path = action.payload.request.path;
				const username = path;

				const queryTweets = {};
				tweets.forEach((t) => (queryTweets[t._id] = t));

				state.cache.profiles = {
					...state.cache.profiles,
					[username]: {
						...state.cache.profiles[username],
						[action.payload.request.type]: Object.keys(queryTweets),
					},
				};
			})
			.addCase(tweet_by_id.pending, (state, action) => {
				state.state = 'LOADING';
			})
			.addCase(tweet_by_id.fulfilled, (state, action) => {
				// console.log('tweetsSlice/tweet_by_id: fulfilled', action.payload);
				state.state = 'LOADED';
				const newTweets = {};

				[action.payload.tweet.tree, action.payload.tweet.replies].forEach((payload) => {
					payload.forEach((p) => {
						newTweets[p._id] = p;
					});
				});

				newTweets[action.payload.id] = {
					...action.payload.tweet.tweet,
					replies: action.payload.tweet.replies,
				};

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
				console.log('tweetsSlice/tweet_add', action.payload);
				const username = action.payload._user;
				const tweet = action.payload;
				delete tweet['_user'];
				state.tweets = { ...state.tweets, [tweet._id]: { ...tweet, replies: [] } };
				state.cache.profiles[`/${username}`] &&
					[
						tweet.type !== 'Reply' && 'FEED',
						tweet.type !== 'Reply' && 'TWEETS',
						'TWEETS_AND_REPLIES',
					].forEach((path) => {
						state.cache.profiles[`/${username}`][path]?.unshift(tweet._id);
					});
				if (tweet.parentTweet) {
					state.tweets[tweet.parentTweet]?.replies.unshift(tweet._id);
					state.cache.selectedTweets[tweet.parentTweet]?.replies?.unshift(tweet._id);
				}
				if (tweet.type === 'Retweet') {
					state.tweets[tweet._id] = {
						...state.tweets[tweet._id],
						retwittedUser: action.payload.retwittedUser,
					};
					const test = {
						...state.tweets[tweet._id],
						retwittedUser: action.payload.retwittedUser,
					};
					console.log('tweetsSlice/tweet_add:fulfilled', test);
				}
				socket.emit('new tweet', action.payload.user._id);
			})
			.addCase(tweets_update.fulfilled, (state, action) => {
				const id = action.payload.id;
				const path = action.payload.path;
				const updated = action.payload.updated;
				const me = action.payload.me;
				// state.state = 'UPDATED';
				state.tweets[id] = {
					...state.tweets[id],
					[path]: updated,
				};
				if (path === 'likedBy') {
					const existed = updated.find((id) => id === me._id);
					if (state.cache.profiles[`/${me.login}`]?.LIKES) {
						if (!existed) {
							state.cache.profiles[`/${me.login}`].LIKES = state.cache.profiles[
								`/${me.login}`
							].LIKES?.filter((like) => like !== id);
						} else {
							state.cache.profiles[`/${me.login}`].LIKES?.unshift(id);
						}
					}
				}
				// socket.emit('new tweet', action.payload.user._id);
			})
			.addCase(tweets_search.pending, (state, action) => {
				state.state = 'LOADING';
			})
			.addCase(tweets_search.fulfilled, (state, action) => {
				state.state = 'LOADED';
				console.log('tweetsSlice/tweetsSearch_fulfilled');

				const newTweets = {};
				action.payload.result.forEach((t) => (newTweets[t._id] = t));
				state.tweets = { ...state.tweets, ...newTweets };

				state.searchResults = action.payload.result.map((tweet) => tweet._id);
			});
	},
});

export const { set_tweets_state, clear_search_results, refresh_feed } = tweetsSlice.actions;
export default tweetsSlice.reducer;
