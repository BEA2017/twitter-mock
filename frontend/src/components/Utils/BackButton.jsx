import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const BackButton = ({ simple }) => {
	const navigate = useNavigate();
	return (
		<div className="back-button" onClick={() => navigate(-1)}>
			<ArrowLeftOutlined className="icon" /> {!simple && <h3>Назад</h3>}
		</div>
	);
};

export default BackButton;
