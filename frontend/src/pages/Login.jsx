import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.scss';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { set_me } from '../store/userSlice';
import { connectSocket } from '../store/sockets';

const Login = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const submitHandler = () => {
		axios.post('/login', { login, password }).then((res) => {
			navigate('/');
			connectSocket(res.data.user);
			dispatch(set_me(res.data.user));
		});
	};

	return (
		<div className="form_container">
			<input
				type={'text'}
				value={login}
				onChange={(e) => setLogin(e.target.value)}
				placeholder={'Логин'}
			/>
			<input
				type={'password'}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder={'Пароль'}
			/>
			<button onClick={submitHandler}>Отправить</button>
		</div>
	);
};

export default Login;
