import { CommentOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Avatar, AvatarSmall } from '../components/Avatar';
import ContactsCarousel from '../components/ContactsCarousel';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import MessengerChat from './MessengerChat';

const Messenger = () => {
	const [contacts, setContacts] = useState([]);
	const me = useSelector((state) => state.users.me);
	const [searchParams, setSearchParams] = useSearchParams();

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
				<MessengerChat sel={searchParams.get('sel')} />
			</div>
		</div>
	);
};

export default Messenger;
