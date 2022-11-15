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
import { useNavigate } from 'react-router';
import { Avatar } from '../components/Avatar';
import Message from '../components/Message';
import Spinner from '../components/Spinner';
import { socket } from '../store/sockets';
import MessengerChatBody from './MessengerChatBody';

const MessengerChat = ({ sel, cb }) => {
	const [companion, setCompanion] = useState();
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const me = useSelector((state) => state.users.me);
	const navigate = useNavigate();

	useEffect(() => {
		setMessages([]);
		setIsLoaded(false);
		sel
			? axios.get(`/profile?login=${sel}`).then((res) => setCompanion(res.data.user))
			: setCompanion();
	}, [sel]);

	useEffect(() => {
		sel && loadMessages();
	}, [companion]);

	const loadMessages = async () => {
		const thread = await axios
			.post(`/thread`, { request: 'getByLogins', participants: [me.login, sel] })
			.then((res) => res.data.thread);
		console.log('thread', thread);
		thread
			? axios.get(`/messages?thread=${thread._id}`).then((res) => {
					setMessages(
						res.data.messages.sort((a, b) =>
							new Date(a.createdAt) >= new Date(b.createdAt) ? 1 : -1,
						),
					);
					setIsLoaded(true);
			  })
			: setIsLoaded(true);
	};

	console.log('MessengerChat/sorting messages', messages);

	const submitMessage = async () => {
		const thread = await axios.post('/thread', {
			request: 'create',
			participants: [me.login, sel],
		});
		await axios.post('/message', { author: me._id, thread: thread.data.thread._id, body: message });
		socket.emit('new message', companion._id);
		await loadMessages();
		await cb();
	};

	socket.on('new message', () => {
		navigate(0);
	});

	return (
		<div className="messenger_chat">
			{companion ? (
				<>
					<div className="chat_header">
						<span>{`${companion.name} ${companion.surname}`}</span>
					</div>
					{!isLoaded ? (
						<div className="chat_body-empty">
							<Spinner />
						</div>
					) : messages.length ? (
						<MessengerChatBody messages={messages} />
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
				<div className="chat_body-empty">
					<CommentOutlined style={{ fontSize: '2em' }} />
					<p>Выберите чат или создайте новый</p>
				</div>
			)}
		</div>
	);
};

export default MessengerChat;

const ChatEmpty = ({ companion }) => {
	return (
		<div className="chat_body-empty">
			<Avatar src={`/images/${companion.avatar}`} />
			<h3>{`${companion.name} ${companion.surname}`}</h3>
			<span>История переписки не найдена</span>
		</div>
	);
};
