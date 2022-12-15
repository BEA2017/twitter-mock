import NewTweet from '../components/Tweets/NewTweet';
import TweetsList from '../components/Tweets/TweetsList';

const Feed = ({ me }) => {
	return (
		<div className="feed_container">
			<header>
				<h3>Главная</h3>
				<NewTweet />
			</header>
			<TweetsList user={me} request={{ path: `/${me.login}`, type: 'FEED' }} />
		</div>
	);
};

export default Feed;
