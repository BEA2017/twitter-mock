import {
	HeartOutlined,
	MessageOutlined,
	PaperClipOutlined,
	ToTopOutlined,
	UserOutlined,
} from '@ant-design/icons';
import '../App.scss';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import NewTweet from './NewTweet';
import { dateFormatter } from '../utils/dateFormatter';
import { Avatar } from './Avatar';
import WithNavLink from '../utils/WithNavLink';

const Tweet = ({ tweet }) => {
	const [showReply, setShowReply] = useState(false);

	const onClickTweetController = (e) => {
		e.preventDefault();
		setShowReply((prev) => !prev);
	};

	return (
		<>
			<div className="tweet_container">
				<WithNavLink username={`/${tweet.user.login}`}>
					{tweet.user.avatar ? <Avatar src={`/images/${tweet.user.avatar}`} /> : <Avatar />}
				</WithNavLink>
				<div className="tweet_info">
					<NavLink to={`/${tweet.user.login}`} className={'navlink'}>
						<span className="tweet_header_name">
							{tweet.user?.name} {tweet.user?.surname}
						</span>
						<span className="tweet_header_login"> @{tweet.user?.login}</span>
					</NavLink>
					<NavLink to={`/tweets/${tweet._id}`} className="navlink">
						<span className="tweet_header_date">
							{' '}
							&#183; {dateFormatter(new Date(tweet.createdAt))}
						</span>
						<div className="tweet_body">
							{tweet.body}
							<div className="tweet_attachments">
								{tweet.attachment && <img src={`/images/${tweet.attachment}`} />}
							</div>
						</div>
						<div className="tweet_controllers">
							<div className="controller">
								<MessageOutlined className="icon" onClick={onClickTweetController} />{' '}
								<span className="controller_info">
									{tweet.replies && tweet.replies.length > 0 && tweet.replies.length}
								</span>
							</div>
							<div className="controller">
								<PaperClipOutlined className="icon" />
							</div>
							<div className="controller">
								<HeartOutlined className="icon" />
							</div>
							<div className="controller">
								<ToTopOutlined className="icon" />
							</div>
						</div>
					</NavLink>
				</div>
			</div>

			<div className="tweet_reply">
				{showReply && (
					<NewTweet
						responseTo={tweet._id}
						input={`@${tweet.user.login}, `}
						cb={() => setShowReply((prev) => !prev)}
					/>
				)}
			</div>
		</>
	);
};

export default Tweet;
