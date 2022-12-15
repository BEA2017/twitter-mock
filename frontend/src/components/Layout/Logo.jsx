import { TwitterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const Logo = () => {
	const navigate = useNavigate();

	return (
		<div className="logo" onClick={() => navigate('/')}>
			<TwitterOutlined />
		</div>
	);
};

export default Logo;
