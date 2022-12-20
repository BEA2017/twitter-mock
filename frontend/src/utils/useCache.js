import { useSelector } from 'react-redux';

const useCache = (username, requestType, tweetId) => {
	const tweetIds = useSelector((state) => {
		// console.log('useCache/tweetIds');
		if (['FEED', 'TWEETS', 'TWEETS_AND_REPLIES', 'LIKES'].includes(requestType)) {
			return (
				state.tweets.cache.profiles[`/${username}`] &&
				state.tweets.cache.profiles[`/${username}`][requestType]
			);
		} else {
			return undefined;
		}
	});
	const cached = useSelector((state) => {
		// console.log('useCache/cached');
		if (requestType === 'TWEET') {
			const selectedTweet = state.tweets.cache.selectedTweets[tweetId];
			let data;
			selectedTweet
				? (data = {
						tweet: state.tweets.tweets[selectedTweet.tweet],
						tree: selectedTweet?.tree.map((t) => {
							return state.tweets.tweets[t];
						}),
						replies: selectedTweet?.replies.map((r) => {
							return state.tweets.tweets[r];
						}),
				  })
				: (data = undefined);
			// console.log('useCache/selectedTweet_data', data);
			return data;
		} else if (requestType === 'SEARCH') {
			const searchResults = [];
			state.tweets.searchResults.forEach((res) => searchResults.push(state.tweets.tweets[res]));
			return searchResults.length > 0 ? searchResults : [];
		} else {
			return tweetIds?.map((id) => state.tweets.tweets[id]) || [];
		}
	});

	return { cached };
};

export default useCache;
