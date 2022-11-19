import NewTweet from '../components/NewTweet';
import Spinner from '../components/Spinner';
import Tweet, { Retweet } from '../components/Tweet';
import { useEffect } from 'react';
import { tweets_download } from '../store/tweetsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from '../store/sockets';

const TweetsList = () => {
	const loadingState = useSelector((state) => state.tweets.state);
	const tweets = useSelector((state) => state.tweets.tweets);
	const me = useSelector((state) => state.users.me);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(tweets_download([...me.subscriptions, me._id]));
	}, []);

	socket &&
		socket.on('new tweet', () => {
			dispatch(tweets_download([...me.subscriptions, me._id]));
		});

	return (
		<>
			<header>
				<h3>Главная</h3>
				<NewTweet />
			</header>
			<main className="list">
				{loadingState === 'NEVER' || loadingState === 'LOADING' ? (
					<Spinner />
				) : loadingState === 'LOADED' && tweets ? (
					tweets.map((t, idx) => {
						return t.type === 'Retweet' ? (
							<Retweet key={idx} tweet={t} />
						) : (
							<Tweet key={idx} tweet={t} />
						);
					})
				) : (
					<>Something went wrong</>
				)}
			</main>
		</>
	);
};

export default TweetsList;
