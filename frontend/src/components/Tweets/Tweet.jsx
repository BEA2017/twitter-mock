import { PaperClipOutlined } from '@ant-design/icons';
import '../../App.scss';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import NewTweet from './NewTweet';
import { dateFormatter } from '../../utils/dateFormatter';
import { Avatar } from '../Profile/Avatar';
import WithNavLink from '../../utils/WithNavLink';
import { useDispatch, useSelector } from 'react-redux';
import { tweets_update, tweet_add } from '../../store/tweetsSlice';
import { useEffect } from 'react';
import axios from 'axios';
import { getUserById } from '../../store/userSlice';
import TweetControllers from './TweetControllers';

const bodyFormatter = (body, query) => {
	const matchIndexes = [];
	let pos = -1;
	do {
		pos = body.toLowerCase().indexOf(query.toLowerCase(), pos + 1);
		pos !== -1 && matchIndexes.push(pos);
	} while (pos !== -1);

	let formattedTweetBody = [];
	let prev = 0;
	matchIndexes.forEach((i, idx) => {
		formattedTweetBody.push(body.slice(prev, i));
		formattedTweetBody.push(
			<span key={idx} className="body_query-result">
				{body.slice(i, i + query.length)}
			</span>,
		);
		prev = i + query.length;
	});
	if (matchIndexes.at(-1) + query.length < body.length) {
		formattedTweetBody.push(body.slice(matchIndexes.at(-1) + query.length, body.length));
	}
	return formattedTweetBody;
};

export const Retweet = ({ tweet }) => {
	const me = useSelector((state) => state.users.me);
	const retwittedBy = useSelector((state) => state.users.users[tweet.user]);
	const retwittedMessage = useSelector((state) => state.tweets.tweets[tweet.retweetBody]);
	const [isMe, setIsMe] = useState(me._id === tweet.user);

	return (
		<div className="retweet_container">
			<div className="retweet_header-wrapper">
				<div className="retweet_header">
					<PaperClipOutlined />
					{isMe ? <span>Вы ретвитнули</span> : <span>{retwittedBy.login} ретвитнул(а)</span>}
				</div>
			</div>
			<Tweet tweet={{ ...retwittedMessage }} />
		</div>
	);
};

const Tweet = ({ tweet, query }) => {
	const [showReply, setShowReply] = useState(false);
	const me = useSelector((state) => state.users.me);
	const author = useSelector((state) => state.users.users[tweet.user]);
	const dispatch = useDispatch();

	const onClickReply = (e) => {
		e.preventDefault();
		setShowReply((prev) => !prev);
	};

	return (
		<>
			<div className="tweet_container">
				<WithNavLink username={`/${author?.login}`}>
					{author?.avatar ? <Avatar src={`/images/${author.avatar}`} /> : <Avatar />}
				</WithNavLink>
				<div className="tweet_info">
					<NavLink to={`/${author?.login}`} className={'navlink'}>
						<span className="tweet_header_name">
							{author?.name} {author?.surname}
						</span>
						<span className="tweet_header_login"> @{author?.login}</span>
					</NavLink>
					<NavLink to={`/tweets/${tweet._id}`} className="navlink">
						<span className="tweet_header_date">
							{' '}
							&#183; {dateFormatter(new Date(tweet.createdAt))}
						</span>
						<div className="tweet_body">
							{query ? bodyFormatter(tweet.body, query) : tweet.body}
							<div className="tweet_attachments">
								{tweet.attachment && <img src={`/images/${tweet.attachment}`} />}
							</div>
						</div>
						<TweetControllers tweet={tweet} cb={onClickReply} me={me} />
					</NavLink>
				</div>
			</div>

			<div className="tweet_reply">
				{showReply && (
					<NewTweet
						parentTweet={tweet._id}
						input={`@${author.login}, `}
						cb={() => setShowReply((prev) => !prev)}
					/>
				)}
			</div>
		</>
	);
};

export default Tweet;
