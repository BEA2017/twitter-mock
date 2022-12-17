import { SearchOutlined } from '@ant-design/icons';
import '../App.scss';
import NewTweet from '../components/Tweets/NewTweet';
import { Modal } from '../components/Utils/Modal';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Logo from '../components/Layout/Logo';
import useSearch from '../utils/useSearch';

const Home = () => {
	const [newTweetModal, setNewTweetModal] = useState(false);
	const { handleSearch, searchQuery, onChangeInput } = useSearch();

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
					<NewTweet cb={() => setNewTweetModal((prev) => !prev)} />
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
						onChange={onChangeInput}
					/>
					<SearchOutlined onClick={handleSearch} className="right-sidebar_search-icon" />
				</div>
				<div className="right-sidebar_recommendations">
					<h4>Вам может понравиться</h4>
				</div>
			</div>
		</div>
	);
};

export default Home;
