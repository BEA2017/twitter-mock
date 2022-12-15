import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tweets_download, tweet_by_id } from '../store/tweetsSlice';
import { getUsers, set_users_state } from '../store/userSlice';
import useCache from './useCache';

//request{
//	type: FEED | TWEET | TWEETS | TWEETS_AND_REPLIES | LIKES,
//  path
//	sender,
//	tweetId
//}
const useTweetsLoader = ({ user, request, tweetId }) => {
	const tweetsLoading = useSelector((state) => state.tweets.state);
	const usersLoading = useSelector((state) => state.users.state);
	const tweets = useCache(user?.login, request.type, tweetId);
	const users = useSelector((state) => state.users.users);
	const [state, setState] = useState('LOADING');

	const dispatch = useDispatch();

	useEffect(() => {
		if (tweetsLoading !== 'LOADED' || usersLoading !== 'LOADED') {
			setState('LOADING');
		} else {
			setState('LOADED');
		}
	}, [tweetsLoading, usersLoading]);

	useEffect(() => {
		if (!tweets && tweetsLoading !== 'LOADING') {
			dispatch(set_users_state('PENDING'));
			request.type === 'TWEET'
				? dispatch(tweet_by_id(tweetId))
				: dispatch(tweets_download({ user, request }));
		}
	});

	useEffect(() => {
		const ids = new Set();
		if (tweetsLoading === 'LOADED' && tweets && request.type !== 'TWEET') {
			tweets.forEach((t) => {
				if (!users[t.user]) {
					ids.add(t.user);
				}
				if (t.retweetBody && !users[t.retweetBody.user._id]) {
					ids.add(t.retweetBody.user._id);
				}
			});
		}
		if (tweetsLoading === 'LOADED' && tweets && request.type === 'TWEET') {
			const userIds = new Set();
			[tweets.tree, tweets.replies].forEach((arr) => {
				arr.forEach((tw) => userIds.add(tw.user));
			});
			userIds.add(tweets.tweet.user);
			userIds.forEach((id) => {
				if (!users[id]) {
					ids.add(id);
				}
			});
		}
		ids.size === 0 ? dispatch(set_users_state('LOADED')) : dispatch(getUsers([...ids.values()]));
	}, [tweetsLoading]);

	return { tweets, users, state };
};

export default useTweetsLoader;
