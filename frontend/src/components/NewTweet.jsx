import '../App.scss';
import { BorderOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tweet_add } from '../store/tweetsSlice';

const NewTweet = ({ input, responseTo, cb }) => {
	const [tweetBody, setTweetBody] = useState(input);
	const me = useSelector((state) => state.users.me);
	const dispatch = useDispatch();

	const addNewTweet = async () => {
		dispatch(tweet_add({ body: tweetBody, me, responseTo }));
		setTweetBody('');
		cb && cb();
	};

	return (
		<div className="home_new-tweet">
			<img className="avatar tweet_avatar" src="http://www.fillmurray.com/100/100" />
			<div className="home_new-tweet_textarea">
				<textarea
					placeholder="Что происходит?"
					value={tweetBody}
					onChange={(e) => setTweetBody(e.target.value)}
				/>
				<div className="home_new-tweet_controllers">
					<div className="icons">
						<BorderOutlined />
						<BorderOutlined />
						<BorderOutlined />
						<BorderOutlined />
						<BorderOutlined />
					</div>
					<div className="button" onClick={addNewTweet}>
						Твитнуть
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewTweet;
