import Message from './Message';

const MessengerChatBody = ({ messages }) => {
	let currentDate;
	return (
		<div className="chat_body">
			{messages
				.map((m, idx) => {
					let messageDate = new Date(m.createdAt).toLocaleDateString();
					if (currentDate !== messageDate) {
						currentDate = messageDate;
						return (
							<div key={idx}>
								<div className="chat_body-date">{currentDate}</div>
								<Message message={m} />
							</div>
						);
					}
					return <Message key={idx} message={m} />;
				})
				.reverse()}
		</div>
	);
};

export default MessengerChatBody;
