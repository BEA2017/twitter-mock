import {
	CommentOutlined,
	PaperClipOutlined,
	PictureOutlined,
	SendOutlined,
	SmileOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '../components/Avatar';

const MessengerChat = ({ sel, th }) => {
	const [companion, setCompanion] = useState();
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const me = useSelector((state) => state.users.me);

	useEffect(() => {
		setMessages([]);
		sel
			? axios.get(`/profile?login=${sel}`).then((res) => setCompanion(res.data.user))
			: setCompanion();
	}, [sel]);

	useEffect(() => {
		const loadMessages = async () => {
			const thread = await axios
				.post(`/thread`, { request: 'get', participants: [me.login, sel] })
				.then((res) => res.data.thread);
			console.log('thread', thread);
			thread &&
				axios.get(`/messages?thread=${thread._id}`).then((res) => setMessages(res.data.messages));
		};

		sel && loadMessages();
	}, [companion]);

	const submitMessage = async () => {
		const thread = await axios.post('/thread', {
			request: 'create',
			participants: [me.login, sel],
		});
		await axios.post('/message', { author: me._id, thread: thread.data.thread._id, body: message });
	};

	return (
		<div className="messenger_chat">
			{companion ? (
				<>
					<div className="chat_header">
						<span>{`${companion.name} ${companion.surname}`}</span>
					</div>
					{messages.length ? (
						messages.map((m, idx) => (
							<div key={idx} className="chat_message">
								{m.body}
							</div>
						))
					) : (
						<ChatEmpty companion={companion} />
					)}
					<div className="chat_input">
						<PaperClipOutlined className="icon" />
						<div className="input_container">
							<input
								type={'text'}
								placeholder={'Напишите сообщение...'}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>
							<PictureOutlined className="icon" />
							<SmileOutlined className="icon" />
						</div>
						<SendOutlined className="icon" onClick={submitMessage} />
					</div>
				</>
			) : (
				<>
					<CommentOutlined style={{ fontSize: '2em' }} />
					<p>Выберите чат или создайте новый</p>
				</>
			)}
		</div>
	);
};

export default MessengerChat;

const ChatEmpty = ({ companion }) => {
	return (
		<>
			<Avatar src={`/images/${companion.avatar}`} />
			<h3>{`${companion.name} ${companion.surname}`}</h3>
			<span>История переписки не найдена</span>
		</>
	);
};
