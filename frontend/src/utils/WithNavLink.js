import { NavLink } from 'react-router-dom';

const WithNavLink = ({ children, username }) => {
	return (
		<NavLink to={username} className={'navlink'}>
			{children}
		</NavLink>
	);
};

export default WithNavLink;
