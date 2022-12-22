import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refresh_feed, tweets_download, tweets_search, tweet_by_id } from '../store/tweetsSlice';
import { getUsers, set_users_state } from '../store/userSlice';
import useCache from './useCache';

//request{
//	type: FEED | TWEET | TWEETS | TWEETS_AND_REPLIES | LIKES | SEARCH,
//  (only for profile group requests)
//    path: /login
// 	(only for search requests):
//	  searchQuery
//	  searchType: TOP | LAST | PEOPLE | IMAGES | VIDEO
//  (only for selected tweet type of requests)
//    tweetId
//}
const useTweetsLoader = ({ user, request, tweetId }) => {
	const tweetsLoading = useSelector((state) => state.tweets.state);
	const usersLoading = useSelector((state) => state.users.state);
	const users = useSelector((state) => state.users.users);
	const { cached } = useCache(user?.login, request.type, tweetId);
	const [state, setState] = useState('NEVER');
	const [mutex, setMutex] = useState(false);
	const [prevSubs, setPrevSubs] = useState(undefined);

	const dispatch = useDispatch();

	const startLoading = () => {
		setState('LOADING');
		setMutex(false);
	};

	const checkCacheIsEmpty = () => {
		if (request.type === 'TWEET' && !cached) {
			return true;
		} else if (request.type !== 'TWEET' && cached.length === 0) {
			return true;
		}
		return false;
	};

	useEffect(() => {
		if (request.type === 'FEED') {
			if (!prevSubs) {
				console.log('START:init');
				setPrevSubs(user.subscriptions);
				startLoading();
			} else if (prevSubs.length !== user.subscriptions.length) {
				console.log('START:refresh');
				setPrevSubs(user.subscriptions);
				dispatch(refresh_feed({ username: user.login }));
				startLoading();
			}
		}
	});

	useEffect(() => {
		if (request.type !== 'FEED') {
			console.log('START:not FEED');
			startLoading();
		}
	}, [request.searchType, request.type, user?.login, tweetId]);

	//1. CHECK CACHE AND IF EMPTY SEND INITIAL TWEET REQUEST (RESULTS WILL BE CACHED)
	useEffect(() => {
		if (state === 'LOADING' && !mutex) {
			console.log('CHECK CACHE');

			setMutex(true);
			dispatch(set_users_state('PENDING'));

			console.log('checkCacheIsEmpty', checkCacheIsEmpty());

			if (checkCacheIsEmpty()) {
				request.type === 'TWEET'
					? dispatch(tweet_by_id(tweetId))
					: request.type === 'SEARCH'
					? dispatch(tweets_search(request))
					: dispatch(tweets_download({ user, request }));
			}
		}
	}, [state]);

	//2. CHECK RESULT OF INITIAL TWEET REQUEST. IF EMPTY - TWEETS NOT FOUND
	useEffect(() => {
		if (tweetsLoading === 'LOADED' && mutex && checkCacheIsEmpty()) {
			console.log('RESULT IS EMPTY');

			setState('EMPTY');
			dispatch(set_users_state('LOADED'));
		}
	}, [tweetsLoading]);

	//3. FOR EACH TWEET CHECK IT'S AUTHOR. IF NOT PRESENT IN USERS STORE - MAKE NETWORK CALL
	useEffect(() => {
		const ids = new Set();
		if (!checkCacheIsEmpty() && tweetsLoading === 'LOADED' && usersLoading !== 'LOADING' && mutex) {
			if (request.type === 'TWEET') {
				console.log('LOAD USERS');

				const userIds = new Set();
				[cached.tree, cached.replies].forEach((arr) => {
					arr.forEach((tw) => userIds.add(tw.user));
				});
				userIds.add(cached.tweet.user);
				userIds.forEach((id) => {
					if (!users[id]) {
						ids.add(id);
					}
				});
			} else if (request.type !== 'TWEET') {
				console.log('LOAD USERS');

				cached.forEach((t) => {
					if (!users[t.user]) {
						ids.add(t.user);
					}
					if (t.retweetBody && !users[t.retwittedUser]) {
						ids.add(t.retwittedUser);
					}
				});
			}

			console.log('useTweetsLoader/users loading', ids);

			ids.size === 0 ? dispatch(set_users_state('LOADED')) : dispatch(getUsers([...ids.values()]));
		}
	}, [tweetsLoading, usersLoading, cached]);

	//4. EXIT STATE MACHINE
	useEffect(() => {
		if ([tweetsLoading, usersLoading].every((state) => state === 'LOADED') && mutex) {
			checkCacheIsEmpty() ? setState('EMPTY') : setState('LOADED');
			setMutex(false);
			console.log('EXIT');
		}
	}, [tweetsLoading, usersLoading]);

	return {
		tweets: state === 'EMPTY' ? [] : cached,
		state,
		startLoading,
	};
};

export default useTweetsLoader;
