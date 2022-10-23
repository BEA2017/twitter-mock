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
	const navigate = useNavigate();

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
				{newTweetModal && (
					<Modal cancel={() => setNewTweetModal(false)}>
						<NewTweet />
					</Modal>
				)}
			</div>
			<div className="home_content">
				<Outlet />
			</div>
			<div className="home_right-sidebar">
				<div className="right-sidebar_header">
					<input
						type={'text'}
						className={'right-sidebar_search'}
						placeholder={'Поиск по твиттеру'}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
