import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tweet from '../components/Tweets/Tweet';
import BackButton from '../components/Utils/BackButton';
import { Avatar } from '../components/Profile/Avatar';
import NewTweet from '../components/Tweets/NewTweet';
import Spinner from '../components/Layout/Spinner';
import useTweetsLoader from '../utils/useTweetsLoader';
import TweetControllers from '../components/Tweets/TweetControllers';
import { Modal } from '../components/Utils/Modal';

const SelectedTweet = () => {
	const { id } = useParams();
	const me = useSelector((state) => state.users.me);
	const { tweets, state } = useTweetsLoader({ request: { type: 'TWEET' }, tweetId: id });
	const users = useSelector((state) => state.users.users);
	const [showModal, setShowModal] = useState(false);

	const onClickReply = (e) => {
		e.preventDefault();
		setShowModal((prev) => !prev);
	};

	if (state === 'LOADING') return <Spinner />;
	if (state === 'EMPTY') return <>Твит не найден</>;

	return (
		tweets?.tweet && (
			<>
				<BackButton />
				<div className="selected-tweet_tree">
					{tweets.tree.map((t, idx) => {
						return (
							<div className="selected-tweet_tree-item" key={idx}>
								<Tweet tweet={t} />
							</div>
						);
					})}
				</div>
				<div className="selected-tweet_container">
					<div className={`selected-tweet ${tweets.tree.length > 0 && 'selected-tweet_tree-root'}`}>
						<div className="selected-tweet_user">
							<Avatar src={`/images/${users[tweets.tweet.user].avatar}`} />
							<div className="userinfo">
								<div className="userinfo_username">
									{users[tweets.tweet.user].name} {users[tweets.tweet.user].surname}
								</div>
								<div className="userinfo_login">@{users[tweets.tweet.user].login}</div>
							</div>
						</div>
						<div className="tweet_body selected-tweet_body">
							<p>{tweets.tweet.body}</p>
							<div className="tweet_attachments selected-tweet_attachments">
								{tweets.tweet.attachment && <img src={`/images/${tweets.tweet.attachment}`} />}
							</div>
						</div>
						<div className="selected-tweet_date">
							<span>{new Date(tweets.tweet.createdAt).toLocaleString()}</span>
						</div>
						<TweetControllers
							tweet={{ ...tweets.tweet, replies: tweets.replies }}
							cb={onClickReply}
							me={me}
						/>
					</div>
				</div>
				{showModal && (
					<Modal cancel={() => setShowModal(false)}>
						<NewTweet
							parentTweet={tweets.tweet._id}
							input={`@${users[tweets.tweet.user].login}, `}
							cb={() => setShowModal((prev) => !prev)}
						/>
					</Modal>
				)}
				<div className="selected-tweet_replies">
					{tweets.replies.map((r, idx) => {
						return <Tweet key={idx} tweet={r} />;
					})}
				</div>
			</>
		)
	);
};

export default SelectedTweet;
