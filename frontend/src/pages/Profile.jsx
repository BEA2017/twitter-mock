import {
	CalendarOutlined,
	EnvironmentOutlined,
	GiftOutlined,
	GlobalOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router';
import BackButton from '../components/BackButton';

const Profile = () => {
	const { profile } = useParams();
	return (
		<>
			<BackButton />
			<div className="profile_container">
				<div
					className="profile_hero"
					style={{
						background: 'url("http://www.fillmurray.com/800/500")',
						backgroundSize: 'cover',
					}}>
					<img
						className="avatar profile_avatar tweet_avatar"
						src="http://www.fillmurray.com/100/100"
					/>
					<div className="cta">
						<div className="button">Изменить профиль</div>
					</div>
				</div>
				<div className="profile_info">
					<div className="name">Владимир Путин</div>
					<div className="login">@putin</div>
					<div className="about">Президент Российской Федерации</div>
					<div className="personal-info">
						<div className="personal-info_first-line">
							<span className="location">
								<EnvironmentOutlined className="icon-info" />
								Москва, Россия
							</span>
							<span className="webpage">
								<GlobalOutlined className="icon-info" />
								kremlin.ru
							</span>
						</div>
						<div className="personal-info_second-line">
							<span className="birthday">
								<GiftOutlined className="icon-info" />
								Дата рождения: 7 октября 1952г.
							</span>
							<span className="registration-date">
								<CalendarOutlined className="icon-info" />
								Регистрация: 22 октября 2022г.
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
