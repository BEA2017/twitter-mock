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
import BackButton from '../components/Utils/BackButton';
import { Modal } from '../components/Utils/Modal';
import ProfileInfo from '../components/Profile/ProfileInfo';
import { ProfileAvatar } from '../components/Profile/Avatar';
import { useEffect } from 'react';
import axios from 'axios';
import { updateFollowList } from '../store/userSlice';
import Spinner from '../components/Layout/Spinner';
import TweetsList from '../components/Tweets/TweetsList';
import { refresh_feed } from '../store/tweetsSlice';

const Profile = () => {
	const login = useParams().profile;
	const [profile, setProfile] = useState();
	const [menuIndex, setMenuIndex] = useState(0);
	const me = useSelector((state) => state.users.me);
	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const getProfileInfo = async () => {
			const result = await axios.get(`/profile?login=${login}`);
			return result.data.user;
		};

		getProfileInfo().then((res) => {
			setProfile(res);
		});
	}, [login, me]);

	const handlePanelItemClick = async (idx) => {
		setMenuIndex(idx);
	};

	const onClickFollow = (type) => {
		dispatch(updateFollowList({ type, followId: profile._id }));
		dispatch(refresh_feed({ username: me.login }));
	};

	const menu = {
		Твиты: 'TWEETS',
		'Твиты и ответы': 'TWEETS_AND_REPLIES',
		Медиа: 'MEDIA',
		Нравится: 'LIKES',
	};

	if (!profile) return <Spinner />;

	return (
		<>
			<BackButton />
			<div className="profile_container">
				<div
					className="profile_hero"
					style={{
						background: 'url("/images/beatles_header.jpg")',
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
								{me.subscriptions.find((sub) => sub._id === profile._id) ? (
									<div className="button" onClick={() => onClickFollow('unfollow')}>
										<UserDeleteOutlined /> Отписаться
									</div>
								) : (
									<div className="button" onClick={() => onClickFollow('follow')}>
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
					{Object.keys(menu).map((i, idx) => {
						return (
							<li
								className={`item ${idx === menuIndex ? 'item-active' : ''}`}
								onClick={() => handlePanelItemClick(idx)}
								key={idx}>
								{i}
							</li>
						);
					})}
				</ul>
				<div className="profile_tweets">
					<TweetsList
						user={profile}
						request={{ path: `/${profile.login}`, type: menu[Object.keys(menu)[menuIndex]] }}
					/>
				</div>
			</div>
		</>
	);
};

export default Profile;
