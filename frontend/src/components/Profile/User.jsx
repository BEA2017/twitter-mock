import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFollowList } from '../../store/userSlice';
import WithNavLink from '../../utils/WithNavLink';
import { AvatarSmall } from './Avatar';

const User = ({ user }) => {
	const me = useSelector((state) => state.users.me);
	const dispatch = useDispatch();
	const isFollowed = useSelector((state) =>
		state.users.me.subscriptions.find((u) => u._id === user._id),
	);

	const onClickFollow = () => {
		dispatch(
			updateFollowList({
				type: `${isFollowed ? 'unfollow' : 'follow'}`,
				followId: user._id,
			}),
		);
	};

	return (
		<div className="user_container">
			<WithNavLink username={user.login}>
				{user.avatar ? <AvatarSmall src={`/images/${user.avatar}`} /> : <AvatarSmall />}
				<div className="user_info">
					<div className="user_info-name">{`${user.name} ${user.surname}`}</div>
					<div className="user_info-login">{`@${user.login}`}</div>
				</div>
			</WithNavLink>
			<div onClick={onClickFollow} className="button button_secondary user-cta">
				{isFollowed ? 'Отписаться' : 'Читать'}
			</div>
		</div>
	);
};

export default User;
