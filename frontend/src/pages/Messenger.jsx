import { CommentOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarSmall } from '../components/Avatar';
import ContactsCarousel from '../components/ContactsCarousel';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import ThreadItem from '../components/ThreadItem';
import MessengerChat from './MessengerChat';

const Messenger = () => {
	const [contacts, setContacts] = useState([]);
	const [threads, setThreads] = useState([]);
	const me = useSelector((state) => state.users.me);
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		setContacts(me.subscriptions);
	}, []);

	useEffect(() => {
		const getUserThreads = async () => {
			const threadData = [];
			const threadInfo = await axios
				.post('/thread', { request: 'getByLogin', login: me.login })
				.then((res) => res.data.threads.map((obj) => obj));
			// console.log('Messenger/getUserThreads', threadInfo);
			await Promise.all(
				threadInfo.map(async (t) => {
					let companion = t.participants.find((p) => p.login !== me.login);
					return await axios
						.get(`/thread?threadId=${t._id}`)
						.then((res) => threadData.push({ companion, messages: res.data.messages }));
				}),
			);
			console.log('Messenger/getUserThreads', threadData);
			setThreads(threadData);
		};
		getUserThreads();
	}, []);

	return (
		<div className="messenger_container">
			<div className="left_sidebar">
				<Logo />
				<Navbar />
			</div>
			<div className="messenger_area">
				<div className="messenger_sidebar">
					<SearchOutlined className="search" />
					<input type={'text'} placeholder={'Поиск'} />
					<div className="messenger_contacts">
						<ContactsCarousel contacts={contacts} />
					</div>
					<div className="messenger_threads">
						{threads.map((t, idx) => {
							return (
								<NavLink key={idx} to={`/im?sel=${t.companion.login}`} className={'navlink'}>
									<ThreadItem companion={t.companion} message={t.messages[t.messages.length - 1]} />
								</NavLink>
							);
						})}
					</div>
				</div>
				<MessengerChat sel={searchParams.get('sel')} />
			</div>
		</div>
	);
};

export default Messenger;
