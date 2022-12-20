import Spinner from '../Layout/Spinner';
import Tweet, { Retweet } from './Tweet';
import { tweets_download } from '../../store/tweetsSlice';
import { useDispatch } from 'react-redux';
import { socket } from '../../store/sockets';
import useTweetsLoader from '../../utils/useTweetsLoader';
import EmptyProfile from '../Profile/EmptyProfile';
import EmptyTweetList from './EmptyTweetList';

//request{
//	type: FEED | TWEET | TWEETS | TWEETS_AND_REPLIES | LIKES,
//  path
//	user,
//	tweetId
//}
const TweetsList = ({ user, request }) => {
	const dispatch = useDispatch();
	const { tweets, state } = useTweetsLoader({ user, request });

	socket &&
		socket.on('new tweet', () => {
			dispatch(tweets_download({ subscriptions: user.subscriptions }));
		});

	const renderTweetList = (tweets) => {
		if (tweets) {
			return tweets.map((t, idx) => {
				return t.type === 'Retweet' ? (
					<Retweet key={idx} tweet={t} />
				) : (
					<Tweet key={idx} tweet={t} />
				);
			});
		} else {
			return <Spinner />;
		}
	};

	return (
		<>
			<main className="list">
				{['LOADING', 'NEVER'].some((s) => state === s) ? (
					<Spinner />
				) : state === 'LOADED' ? (
					renderTweetList(tweets)
				) : state === 'EMPTY' ? (
					request.type === 'FEED' ? (
						<EmptyProfile />
					) : (
						<EmptyTweetList />
					)
				) : (
					<>Something went wrong</>
				)}
			</main>
		</>
	);
};

export default TweetsList;
