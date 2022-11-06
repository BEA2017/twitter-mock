import { useSelector } from 'react-redux';
import { AvatarSmall } from './Avatar';

const ThreadItem = ({ companion, message }) => {
	const me = useSelector((state) => state.users.me);

	return (
		<div className="thread-item_container">
			<div className="thread-item_avatar">
				<AvatarSmall src={`/images/${companion.avatar}`} />
			</div>
			<div className="thread-item_body">
				<div className="info">
					<span>
						{companion.name} {companion.surname}
					</span>
					<span className="date"> {new Date(message.createdAt).toLocaleDateString()}</span>
				</div>
				<div className="message">
					{message.author._id === me._id && <span>Вы: </span>}
					{message.body}
				</div>
			</div>
		</div>
	);
};

export default ThreadItem;
