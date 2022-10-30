import {
	CalendarOutlined,
	EnvironmentOutlined,
	GiftOutlined,
	GlobalOutlined,
	UserAddOutlined,
	UserDeleteOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import BackButton from '../components/BackButton';
import { Modal } from '../components/Modal';
import ProfileInfo from './ProfileInfo';
import { ProfileAvatar } from '../components/Avatar';
import { useEffect } from 'react';
import axios from 'axios';
import { updateFollowList } from '../store/userSlice';
import Spinner from '../components/Spinner';
import Tweet from '../components/Tweet';

const Profile = () => {
	const login = useParams().profile;
	const [profile, setProfile] = useState();
	const [panelItem, setPanelItem] = useState(0);
	const me = useSelector((state) => state.users.me);
	const [tweets, setTweets] = useState();
	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const getProfileInfo = async () => {
			const result = await axios.get(`/profile?login=${login}`);
			return result.data.user;
		};

		getProfileInfo().then((res) => {
			setProfile(res);
			console.log(res);
		});
	}, [login, me]);

	useEffect(() => {
		profile &&
			axios.post('/tweets', { id: profile._id }).then((res) => {
				setTweets(res.data.tweets);
			});
	}, [profile]);

	const handlePanelItemClick = async (idx) => {
		setPanelItem(idx);
		axios.post('/tweets', { id: profile._id }).then((res) => {
			setTweets(res.data.tweets);
		});
	};

	if (!profile) return <Spinner />;

	return (
		<>
			<BackButton />
			<div className="profile_container">
				<div
					className="profile_hero"
					style={{
						background:
							'url("https://pbs.twimg.com/profile_banners/1019169865/1401944529/1500x500")',
						backgroundSize: 'contain',
					}}>
					{profile.avatar ? <ProfileAvatar src={`/images/${profile.avatar}`} /> : <ProfileAvatar />}
					<div className="cta">
						{login === me.login ? (
							<div className="button" onClick={() => setShowModal((prev) => !prev)}>
								Изменить профиль
							</div>
						) : (
							<div>
								{me.subscriptions.includes(profile._id) ? (
									<div
										className="button"
										onClick={() =>
											dispatch(updateFollowList({ type: 'unfollow', followId: profile._id }))
										}>
										<UserDeleteOutlined /> Отписаться
									</div>
								) : (
									<div
										className="button"
										onClick={() =>
											dispatch(updateFollowList({ type: 'follow', followId: profile._id }))
										}>
										<UserAddOutlined /> Читать
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				{showModal && (
					<Modal cancel={() => setShowModal(false)}>
						<ProfileInfo cb={() => setShowModal(false)} />
					</Modal>
				)}
				<div className="profile_info">
					<div className="name">
						{profile.name} {profile.surname}
					</div>
					<div className="login">@{profile.login}</div>
					<div className="about">{profile.about || 'Расскажите о себе'}</div>
					<div className="personal-info">
						<div className="personal-info_first-line">
							<span className="location">
								<EnvironmentOutlined className="icon-info" />
								{profile.city || 'Укажите город'}
							</span>
							<span className="webpage">
								<GlobalOutlined className="icon-info" />
								{profile.webpage || 'Укажите сайт'}
							</span>
						</div>
						<div className="personal-info_second-line">
							<span className="birthday">
								<GiftOutlined className="icon-info" />
								Дата рождения: 18 июня 1942г.
							</span>
							<span className="registration-date">
								<CalendarOutlined className="icon-info" />
								Регистрация: 22 октября 2022г.
							</span>
						</div>
						<div className="personal-info_third-line">
							<div>
								<span>{profile.subscriptions.length}</span> в читаемых
							</div>
							<span>{profile.subscribers}</span> читателей
						</div>
					</div>
				</div>
				<ul className="profile_panel">
					{['Твиты', 'Твиты и ответы', 'Медиа', 'Нравится'].map((i, idx) => {
						return (
							<li
								className={`item ${idx === panelItem ? 'item-active' : ''}`}
								onClick={() => handlePanelItemClick(idx)}
								key={idx}>
								{i}
							</li>
						);
					})}
				</ul>
				<div className="profile_tweets">
					{tweets &&
						tweets.map((i, idx) => {
							return <Tweet key={idx} tweet={i} />;
						})}
				</div>
			</div>
		</>
	);
};

export default Profile;
