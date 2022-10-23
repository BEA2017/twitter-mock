import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import '../App.scss';

const Register = () => {
	const [login, setLogin] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const dispatch = useDispatch();

	const submitHandler = async () => {
		await axios.post('/register', { login, name, surname, email, password });
	};

	return (
		<div className="auth_container">
			<input
				type={'text'}
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder={'Имя'}
			/>
			<input
				type={'text'}
				value={surname}
				onChange={(e) => setSurname(e.target.value)}
				placeholder={'Фамилия'}
			/>
			<input
				type={'text'}
				value={login}
				onChange={(e) => setLogin(e.target.value)}
				placeholder={'Логин'}
			/>
			<input
				type={'text'}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder={'Email'}
			/>
			<input
				type={'password'}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder={'Пароль'}
			/>
			<input
				type={'password'}
				value={password2}
				onChange={(e) => setPassword2(e.target.value)}
				placeholder={'Повторите пароль'}
			/>
			<button type="submit" onClick={submitHandler}>
				Отправить
			</button>
		</div>
	);
};

export default Register;
