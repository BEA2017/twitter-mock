import { MessageOutlined, SearchOutlined, TeamOutlined, TwitterOutlined } from '@ant-design/icons';
import { useState } from 'react';
import '../App.scss';
import { Modal } from '../components/Modal';
import Login from './Login';
import Register from './Register';

const StartingPage = () => {
	const [registerOpen, setRegisterOpen] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);

	return (
		<div className="login_page-container">
			<div className="login-promo">
				<div className="bg">
					<TwitterOutlined />
				</div>
				<ul className="login-promo_list">
					<li className="login-promo_list-item">
						<h2>
							<SearchOutlined /> Читайте о том, что вам интересно
						</h2>
					</li>
					<li className="login-promo_list-item">
						<h2>
							<TeamOutlined /> Узнавайте, о чем говорят в мире
						</h2>
					</li>
					<li className="login-promo_list-item">
						<h2>
							<MessageOutlined /> Присоединяйтесь к общению
						</h2>
					</li>
				</ul>
			</div>
			<div className="login-form">
				<h1 className="login-form_slogan">Узнайте, что происходит в мире прямо сейчас</h1>
				<h3 className="login-form_slogan">Присоединяйтесь к твиттеру</h3>
				<div className="login_register-button button" onClick={() => setRegisterOpen(true)}>
					Зарегистрироваться
				</div>
				<div className="login_login-button button" onClick={() => setLoginOpen(true)}>
					Войти
				</div>
			</div>
			{registerOpen && (
				<Modal title="Регистрация" cancel={() => setRegisterOpen(false)}>
					<Register />
				</Modal>
			)}
			{loginOpen && (
				<Modal title="Вход" cancel={() => setLoginOpen(false)}>
					<Login />
				</Modal>
			)}
		</div>
	);
};

export default StartingPage;
