import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tweet from '../components/Tweet';
import {
	HeartOutlined,
	MessageOutlined,
	PaperClipOutlined,
	ToTopOutlined,
	UserOutlined,
} from '@ant-design/icons';
import BackButton from '../components/BackButton';
import { Avatar } from '../components/Avatar';

const SelectedTweet = () => {
	const { id } = useParams();
	const [tweet, setTweet] = useState();
	const tweets = useSelector((state) => state.tweets.tweets);
	const navigate = useNavigate();

	useEffect(() => {
		setTweet(tweets.find((t) => t._id == id));
	}, []);

	return tweet ? (
		<>
			<BackButton />
			<div className="selected-tweet_container">
				<div className="selected-tweet">
					<div className="selected-tweet_user">
						<Avatar src={`/images/${tweet.user.avatar}`} />
						{/* <div className="avatar tweet-avatar_default">
							<UserOutlined />
						</div> */}
						<div className="userinfo">
							<div className="userinfo_username">
								{tweet.user.name} {tweet.user.surname}
							</div>
							<div className="userinfo_login">@{tweet.user.login}</div>
						</div>
					</div>
					<div className="tweet_body selected-tweet_body">
						<p>{tweet.body}</p>
						<div className="tweet_attachments selected-tweet_attachments">
							{tweet.attachment && <img src={`/images/${tweet.attachment}`} />}
						</div>
					</div>
					<div className="selected-tweet_date">
						<span>{new Date(tweet.createdAt).toLocaleString()}</span>
					</div>
					<div className="tweet_controllers">
						<MessageOutlined className="icon" />
						<PaperClipOutlined className="icon" />
						<HeartOutlined className="icon" />
						<ToTopOutlined className="icon" />
					</div>
				</div>
			</div>
			<div className="selected-tweet_replies">
				{tweet.replies &&
					tweet.replies.length > 0 &&
					tweet.replies.map((r, idx) => {
						return <Tweet key={idx} tweet={r} />;
					})}
			</div>
		</>
	) : (
		<>Твит не найден</>
	);
};

export default SelectedTweet;
