import User from './User';

const UserList = ({ users }) => {
	return (
		<div className="user-list_container">
			{users.map((u, idx) => (
				<User key={idx} user={u} />
			))}
		</div>
	);
};

export default UserList;
