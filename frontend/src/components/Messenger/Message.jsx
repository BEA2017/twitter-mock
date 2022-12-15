import { dateFormatter, messengerTimeFormatter } from '../../utils/dateFormatter';
import { AvatarSmall } from '../Profile/Avatar';

const Message = ({ message }) => {
	return (
		<div className="chat_message">
			<AvatarSmall src={`/images/${message.author.avatar}`} />
			<div className="chat_message-body">
				<div className="chat_message-body_info">
					<span>{message.author.name} </span>
					<span>{messengerTimeFormatter(message.createdAt)}</span>
				</div>
				<div>{message.body}</div>
			</div>
		</div>
	);
};

export default Message;
