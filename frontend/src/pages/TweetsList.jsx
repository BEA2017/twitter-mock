import NewTweet from '../components/NewTweet';
import Spinner from '../components/Spinner';
import Tweet from '../components/Tweet';
import { useEffect } from 'react';
import { tweets_download } from '../store/tweetsSlice';
import { useSelector, useDispatch } from 'react-redux';

const TweetsList = () => {
	const loadingState = useSelector((state) => state.tweets.state);
	const tweets = useSelector((state) => state.tweets.tweets);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(tweets_download());
	}, []);

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
						return <Tweet key={idx} tweet={t} />;
					})
				) : (
					<>Something went wrong</>
				)}
			</main>
		</>
	);
};

export default TweetsList;
