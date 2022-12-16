import {
	HeartOutlined,
	MessageOutlined,
	PaperClipOutlined,
	ToTopOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { tweets_update, tweet_add } from '../../store/tweetsSlice';

const TweetControllers = ({ tweet, me, cb }) => {
	const dispatch = useDispatch();

	const onClickRetweet = async (e) => {
		e.preventDefault();
		dispatch(tweet_add({ retweetId: tweet._id, retweetBody: tweet, me, type: 'Retweet' }));
		dispatch(tweets_update({ id: tweet._id, path: 'retweettedBy', me }));
	};

	const onClickLike = async (e) => {
		e.preventDefault();
		dispatch(tweets_update({ id: tweet._id, path: 'likedBy', me }));
	};

	return (
		<div className="tweet_controllers">
			<div className="controller">
				<MessageOutlined className="icon" onClick={cb} />{' '}
				<span className="controller_info">{tweet.replies?.length}</span>
			</div>
			<div className="controller">
				<PaperClipOutlined className="icon" onClick={onClickRetweet} />
				<span className="controller_info">
					{tweet.retweettedBy && tweet.retweettedBy.length > 0 && tweet.retweettedBy.length}
				</span>
			</div>
			<div className="controller">
				<HeartOutlined className="icon" onClick={onClickLike} />
				<span className="controller_info">
					{tweet.likedBy && tweet.likedBy.length > 0 && tweet.likedBy.length}
				</span>
			</div>
			<div className="controller">
				<ToTopOutlined className="icon" />
			</div>
		</div>
	);
};

export default TweetControllers;
