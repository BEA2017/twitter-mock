import { SearchOutlined, TwitterOutlined } from '@ant-design/icons';
import '../App.scss';
import NewTweet from '../components/NewTweet';
import { Modal } from '../components/Modal';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';

const Home = () => {
	const [newTweetModal, setNewTweetModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const navigate = useNavigate();

	const handleSearch = () => {
		setSearchQuery('');
		navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
	};

	return (
		<div className="home_container">
			<div className="left_sidebar home_left-sidebar">
				<Logo />
				<Navbar />
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
