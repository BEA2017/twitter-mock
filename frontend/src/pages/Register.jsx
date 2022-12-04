import { useState } from 'react';
import axios from 'axios';
import '../App.scss';
import { validateRegistration } from '../utils/validators';
import { CheckOutlined, WarningOutlined } from '@ant-design/icons';

const Register = () => {
	const [login, setLogin] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [errors, setErrors] = useState([]);
	const [success, setSuccess] = useState(false);

	const submitHandler = async () => {
		setErrors([]);
		const validationErrors = validateRegistration({
			login,
			name,
			surname,
			email,
			password,
			password2,
		});
		console.log('Register/submitHandler', validationErrors);
		setErrors(validationErrors);
		Object.keys(validationErrors).length === 0 &&
			(await axios
				.post('/register', { login, name, surname, email, password })
				.then((res) => setSuccess(true))
				.catch((e) => {
					setErrors({ serverError: [e.response.data.message] });
				}));
	};

	const validateKey = (key) => {
		const registrationErrors =
			errors[key] &&
			errors[key].map((e, idx) => {
				return (
					<div key={idx} style={{ color: 'red' }}>
						<WarningOutlined />
						{e}
					</div>
				);
			});
		return (
			registrationErrors && (
				<div className="errors" style={{ marginBottom: '1em' }}>
					{registrationErrors}
				</div>
			)
		);
	};

	if (success) return <Success />;

	return (
		<div className="form_container">
			<label htmlFor="name">Имя</label>
			<input
				type={'text'}
				id="name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder={'Имя'}
			/>
			{validateKey('name')}
			<label htmlFor="surname">Фамилия</label>
			<input
				type={'text'}
				id="surname"
				value={surname}
				onChange={(e) => setSurname(e.target.value)}
				placeholder={'Фамилия'}
			/>
			{validateKey('surname')}
			<label htmlFor="login">Логин</label>
			<input
				type={'text'}
				id="login"
				value={login}
				onChange={(e) => setLogin(e.target.value)}
				placeholder={'Логин'}
			/>
			{validateKey('login')}
			<label htmlFor="email">Email</label>
			<input
				type={'text'}
				id="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder={'Email'}
			/>
			{validateKey('email')}
			<label htmlFor="password">Пароль</label>
			<input
				type={'password'}
				id="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder={'Пароль'}
			/>
			{validateKey('password')}
			<label htmlFor="password2">Повторите пароль</label>
			<input
				type={'password'}
				id="password2"
				value={password2}
				onChange={(e) => setPassword2(e.target.value)}
				placeholder={'Повторите пароль'}
			/>
			{validateKey('password2')}
			<button
				disabled={
					!login || !name || !surname || !email || !password || !password2 || password !== password2
				}
				type="submit"
				onClick={submitHandler}>
				Отправить
			</button>
			{errors.serverError && (
				<div className="errors" style={{ marginBottom: '1em', textAlign: 'center', color: 'red' }}>
					<span>
						<WarningOutlined /> {errors.serverError}
					</span>
				</div>
			)}
		</div>
	);
};

const Success = () => {
	return (
		<div style={{ textAlign: 'center' }}>
			<div style={{ color: 'green', fontSize: '6em' }}>
				<CheckOutlined />
			</div>
			<div style={{ fontSize: '1.5em' }}>Пользователь создан!</div>
		</div>
	);
};

export default Register;
