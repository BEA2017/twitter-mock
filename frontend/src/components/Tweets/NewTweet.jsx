import '../../App.scss';
import { FileImageOutlined, SmileOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tweet_add } from '../../store/tweetsSlice';
import Profile from '../../pages/Profile';
import { Avatar } from '../Profile/Avatar';
import { createRef } from 'react';
import axios from 'axios';
import { socket } from '../../App';

const NewTweet = ({ input, parentTweet, cb }) => {
	const [tweetBody, setTweetBody] = useState(input);
	const [attachment, setAttachment] = useState('');
	const [file, setFile] = useState('');
	const me = useSelector((state) => state.users.me);
	const dispatch = useDispatch();

	const addNewTweet = async () => {
		axios.post('/save', { file: attachment }).then((res) =>
			dispatch(
				tweet_add({
					body: tweetBody,
					me,
					parentTweet,
					attachment,
					type: parentTweet ? 'Reply' : 'Tweet',
				}),
			),
		);
		setTweetBody('');
		setAttachment('');
		cb && cb();
	};

	const attach_input = createRef();
	const onAttachClick = () => {
		attach_input.current.click();
	};

	useEffect(() => {
		if (file !== '') {
			const bodyFormData = new FormData();
			bodyFormData.append('image', file);
			axios({
				method: 'post',
				url: '/upload',
				data: bodyFormData,
				headers: { 'Content-Type': 'multipart/form-data' },
			})
				.then(function (response) {
					setAttachment(response.data.message.filename);
					console.log('success', response);
				})
				.catch(function (response) {
					console.log('error', response);
				});
		}
	}, [file]);

	return (
		<div className="home_new-tweet">
			{me.avatar ? <Avatar src={`/images/${me.avatar}`} /> : <Avatar />}
			<div className="home_new-tweet_textarea">
				<textarea
					placeholder="Что происходит?"
					value={tweetBody}
					onChange={(e) => setTweetBody(e.target.value)}
				/>
				<div className="home_new-tweet_controllers">
					<div className="icons">
						<SmileOutlined style={{ height: '30.8px' }} className="icon" />
						<div onClick={onAttachClick}>
							<FileImageOutlined className="icon" />
							<input
								type={'file'}
								name={'image'}
								onChange={(e) => setFile(e.target.files[0])}
								ref={attach_input}
								style={{ display: 'none' }}
							/>
						</div>
					</div>
					<div className="button" onClick={addNewTweet}>
						Твитнуть
					</div>
				</div>
				<div className="attachments">
					{attachment && (
						<div className="attachments_item">
							<img className="attachments_item-img" src={`/images/tmp/${attachment}`} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default NewTweet;
