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
		if (tweets.length === 0) {
			return request.type === 'FEED' ? <EmptyProfile /> : <EmptyTweetList />;
		} else {
			return tweets.map((t, idx) => {
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
			<main className="list">
				{state === 'LOADING' ? (
					<Spinner />
				) : state === 'LOADED' && tweets ? (
					renderTweetList(tweets)
				) : (
					<>Something went wrong</>
				)}
			</main>
		</>
	);
};

export default TweetsList;