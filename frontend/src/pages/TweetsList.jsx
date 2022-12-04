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

	const renderTweetList = (tweets) => {
		if (tweets.length === 0) {
			return <EmptyList />;
		} else {
			return tweets
				.filter((t) => t.type === 'Tweet' || t.type === 'Retweet')
				.map((t, idx) => {
					return t.type === 'Retweet' ? (
						<Retweet key={idx} tweet={t} />
					) : (
						<Tweet key={idx} tweet={t} />
					);
				});
		}
	};

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
					renderTweetList(tweets)
				) : (
					<>Something went wrong</>
				)}
			</main>
		</>
	);
};

const EmptyList = () => {
	return (
		<div style={{ textAlign: 'center' }}>
			<h1 style={{ marginBottom: '1em' }}>Добро пожаловать в твиттер!</h1>
			<h4>Следите за популярными темами</h4>
			<div>а также</div>
			<h4>Делитесь своими эмоциями</h4>
		</div>
	);
};

export default TweetsList;
