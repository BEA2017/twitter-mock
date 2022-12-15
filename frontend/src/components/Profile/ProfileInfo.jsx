import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from './Avatar';
import { updateProfileInfo } from '../../store/userSlice';

const ProfileInfo = ({ cb }) => {
	const me = useSelector((state) => state.users.me);
	const [name, setName] = useState(me.name || '');
	const [surname, setSurname] = useState(me.surname || '');
	const [avatarTmp, setAvatarTmp] = useState('');
	const [about, setAbout] = useState(me.about || '');
	const [city, setCity] = useState(me.city || '');
	const [webpage, setWebpage] = useState(me.webpage || '');
	const [birthdate, setBirthdate] = useState(me.birthdate || '');
	const dispatch = useDispatch();

	const [file, setFile] = useState('');

	const submitHandler = async () => {
		axios
			.post('/save', { file: avatarTmp })
			.then((res) =>
				avatarTmp
					? dispatch(updateProfileInfo({ name, surname, about, city, webpage, avatar: avatarTmp }))
					: dispatch(updateProfileInfo({ name, surname, about, city, webpage })),
			);
		cb();
	};

	const avatar_input = React.createRef();

	useEffect(() => {
		if (file !== '') {
			const bodyFormData = new FormData();
			bodyFormData.append('image', file);
			axios({
				method: 'post',
				url: '/upload',
				data: bodyFormData,
				headers: { 'Content-Type': 'multipart/form-data' },
			})
				.then(function (response) {
					setAvatarTmp(response.data.message.filename);
					console.log('success', response);
				})
				.catch(function (response) {
					console.log('error', response);
				});
		}
	}, [file]);

	const uploadAvatar = async () => {
		await avatar_input.current.click();
	};

	return (
		<div className="profile_container form_container">
			<div className="avatar_container">
				<div onClick={uploadAvatar}>
					{avatarTmp ? (
						<Avatar src={`/images/tmp/${avatarTmp}`} />
					) : me.avatar ? (
						<Avatar src={`/images/${me.avatar}`} />
					) : (
						<Avatar />
					)}
				</div>
				<input
					type={'file'}
					name={'image'}
					onChange={(e) => setFile(e.target.files[0])}
					ref={avatar_input}
					style={{ display: 'none' }}
				/>
			</div>
			<div className="profile_name">
				<label htmlFor="name">Имя</label>
				<input
					type={'text'}
					id="name"
					value={name}
					placeholder={'Имя'}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className="profile_surname">
				<label htmlFor="surname">Фамилия</label>
				<input
					type={'text'}
					id="surname"
					value={surname}
					placeholder={'Фамилия'}
					onChange={(e) => setSurname(e.target.value)}
				/>
			</div>
			{/* <div className="profile_avatar">
				<input type={text} value={avatar} onChange={(e) => setAvatar(e)} />
			</div> */}
			<div className="profile_about">
				<label htmlFor="about">О себе</label>
				<input
					type={'text'}
					id="about"
					value={about}
					placeholder={'О себе'}
					onChange={(e) => setAbout(e.target.value)}
				/>
			</div>
			<div className="profile_city">
				<label htmlFor="city">Город</label>
				<input
					type={'text'}
					id="city"
					value={city}
					placeholder={'Город'}
					onChange={(e) => setCity(e.target.value)}
				/>
			</div>
			<div className="profile_webpage">
				<label htmlFor="webpage">Сайт</label>
				<input
					type={'text'}
					id="webpage"
					value={webpage}
					placeholder={'Веб-страница'}
					onChange={(e) => setWebpage(e.target.value)}
				/>
			</div>
			{/* <div className="profile_birthdate">
				<input type={text} value={birthdate} onChange={(e) => setBirthdate(e)} />
			</div> */}
			<div className="button button_primary" onClick={submitHandler}>
				Сохранить
			</div>
		</div>
	);
};

export default ProfileInfo;
