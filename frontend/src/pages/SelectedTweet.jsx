import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import NewTweet from '../components/NewTweet';
import axios from 'axios';
import Spinner from '../components/Spinner';

const SelectedTweet = () => {
	const { id } = useParams();
	const [tweet, setTweet] = useState();
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		setIsInitialized(false);
		axios.get(`/tweet?id=${id}`).then((res) => {
			setTweet(res.data);
			setIsInitialized(true);
		});
	}, [id]);

	if (!isInitialized) return <Spinner />;

	return tweet ? (
		<>
			<BackButton />
			<div className="selected-tweet_tree">
				{tweet.tree &&
					tweet.tree.map((t, idx) => {
						return (
							<div className="selected-tweet_tree-item" key={idx}>
								<Tweet tweet={t} />
							</div>
						);
					})}
			</div>
			<div className="selected-tweet_container">
				<div className={`selected-tweet ${tweet.tree.length > 0 && 'selected-tweet_tree-root'}`}>
					<div className="selected-tweet_user">
						<Avatar src={`/images/${tweet.tweet.user.avatar}`} />
						<div className="userinfo">
							<div className="userinfo_username">
								{tweet.tweet.user.name} {tweet.tweet.user.surname}
							</div>
							<div className="userinfo_login">@{tweet.tweet.user.login}</div>
						</div>
					</div>
					<div className="tweet_body selected-tweet_body">
						<p>{tweet.tweet.body}</p>
						<div className="tweet_attachments selected-tweet_attachments">
							{tweet.tweet.attachment && <img src={`/images/${tweet.tweet.attachment}`} />}
						</div>
					</div>
					<div className="selected-tweet_date">
						<span>{new Date(tweet.tweet.createdAt).toLocaleString()}</span>
					</div>
					<div className="tweet_controllers">
						<MessageOutlined className="icon" />
						<PaperClipOutlined className="icon" />
						<HeartOutlined className="icon" />
						<ToTopOutlined className="icon" />
					</div>
				</div>
			</div>
			<div className="selected-tweet_new-reply">
				<NewTweet parentTweet={tweet.tweet._id} />
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
