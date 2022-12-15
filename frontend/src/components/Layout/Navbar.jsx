import {
	BookOutlined,
	BulbOutlined,
	FileTextOutlined,
	MessageOutlined,
	SearchOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
	const me = useSelector((state) => state.users.me);

	return (
		<ul>
			<li>
				<SearchOutlined /> Поиск
			</li>
			<li>
				<BulbOutlined /> Уведомления
			</li>
			<li>
				<NavLink to={`/im`} className="navlink">
					<MessageOutlined /> Сообщения
				</NavLink>
			</li>
			<li>
				<BookOutlined /> Закладки
			</li>
			<li>
				<FileTextOutlined /> Список
			</li>
			<li>
				<NavLink to={`/${me.login}`} className="navlink">
					<UserOutlined /> Профиль
				</NavLink>
			</li>
		</ul>
	);
};

export default Navbar;
