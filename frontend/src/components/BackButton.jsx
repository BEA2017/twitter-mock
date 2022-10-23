import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const BackButton = () => {
	const navigate = useNavigate();
	return (
		<div className="back-button" onClick={() => navigate(-1)}>
			<ArrowLeftOutlined className="icon" /> <h3>Назад</h3>
		</div>
	);
};

export default BackButton;
