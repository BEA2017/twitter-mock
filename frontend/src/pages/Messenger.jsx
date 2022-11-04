import { CommentOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarSmall } from '../components/Avatar';
import ContactsCarousel from '../components/ContactsCarousel';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';

const Messenger = () => {
	const [contacts, setContacts] = useState([]);
	const me = useSelector((state) => state.users.me);

	useEffect(() => {
		setContacts(me.subscriptions);
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
				</div>
				<div className="messenger_chat">
					<CommentOutlined style={{ fontSize: '2em' }} />
					<p>Выберите чат или создайте новый</p>
				</div>
			</div>
		</div>
	);
};

export default Messenger;
