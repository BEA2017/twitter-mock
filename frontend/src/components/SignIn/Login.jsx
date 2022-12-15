import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.scss';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { set_me } from '../../store/userSlice';
import { connectSocket } from '../../store/sockets';
import { WarningOutlined } from '@ant-design/icons';

const Login = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const submitHandler = () => {
		setError('');
		axios
			.post('/login', { login, password })
			.then((res) => {
				navigate('/');
				connectSocket(res.data.user);
				dispatch(set_me(res.data.user));
			})
			.catch((e) => {
				setError(e.response.data.message);
			});
	};

	return (
		<div className="form_container">
			<label htmlFor="login">Логин</label>
			<input
				type={'text'}
				id={'login'}
				value={login}
				onChange={(e) => setLogin(e.target.value)}
				placeholder={'Логин'}
			/>
			<label htmlFor="password">Пароль</label>
			<input
				type={'password'}
				id={'password'}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder={'Пароль'}
			/>
			<button disabled={!login || !password} onClick={submitHandler}>
				Отправить
			</button>
			{error && (
				<span style={{ color: 'red', textAlign: 'center' }}>
					<WarningOutlined /> {error}
				</span>
			)}
		</div>
	);
};

export default Login;
