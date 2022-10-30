import { UserOutlined } from '@ant-design/icons';

export const Avatar = ({ src, onClick }) => {
	return src ? (
		<div className="avatar tweet_avatar">
			<img onClick={onClick} src={src} />
		</div>
	) : (
		<div className={`avatar tweet-avatar_default`}>
			<UserOutlined />
		</div>
	);
};

export const ProfileAvatar = ({ src, onClick }) => {
	return (
		<>
			{src ? (
				<div className="avatar profile_avatar tweet_avatar">
					<img onClick={onClick} src={src} />
				</div>
			) : (
				<div className={`avatar profile_avatar tweet-avatar_default`} onClick={onClick}>
					<UserOutlined />
				</div>
			)}
		</>
	);
};
