import {
	BookOutlined,
	BorderOutlined,
	BulbOutlined,
	FileTextOutlined,
	MessageOutlined,
	SearchOutlined,
	TwitterOutlined,
	UserOutlined,
} from '@ant-design/icons';
import '../App.scss';
import NewTweet from '../components/NewTweet';
import { Modal } from '../components/Modal';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Home = () => {
	const [newTweetModal, setNewTweetModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const navigate = useNavigate();

	const handleSearch = () => {
		navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
		// navigate(`/search?q=${searchQuery}`);
	};

	return (
		<div className="home_container">
			<div className="home_left-sidebar">
				<div className="logo icon" onClick={() => navigate('/')}>
					<TwitterOutlined />
				</div>
				<ul>
					<li>
						<SearchOutlined /> Поиск
					</li>
					<li>
						<BulbOutlined /> Уведомления
					</li>
					<li>
						<MessageOutlined /> Сообщения
					</li>
					<li>
						<BookOutlined /> Закладки
					</li>
					<li>
						<FileTextOutlined /> Список
					</li>
					<li>
						<UserOutlined /> Профиль
					</li>
				</ul>
				<div className="button" onClick={() => setNewTweetModal(true)}>
					Твитнуть
				</div>
			</div>
			{newTweetModal && (
				<Modal cancel={() => setNewTweetModal(false)}>
					<NewTweet />
				</Modal>
			)}
			<div className="home_content">
				<Outlet />
			</div>
			<div className="home_right-sidebar">
				<div className="right-sidebar_header">
					<input
						type={'text'}
						className={'right-sidebar_search'}
						placeholder={'Поиск по твиттеру'}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<SearchOutlined onClick={handleSearch} className="right-sidebar_search-icon" />
				</div>
			</div>
		</div>
	);
};

export default Home;
