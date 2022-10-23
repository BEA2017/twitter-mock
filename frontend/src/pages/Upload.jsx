import axios from 'axios';
import { useState } from 'react';

const Upload = () => {
	const [file, setFile] = useState('');

	const clickHandler = (e) => {
		e.preventDefault();
		const bodyFormData = new FormData();
		bodyFormData.append('avatar', file);
		axios({
			method: 'post',
			url: '/upload',
			data: bodyFormData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
			.then(function (response) {
				//handle success
				console.log('success', response);
			})
			.catch(function (response) {
				//handle error
				console.log('error', response);
			});
	};

	return (
		<div>
			<input onChange={(e) => setFile(e.target.files[0])} type="file" name="avatar" />
			<button type="submit" onClick={clickHandler}>
				Submit
			</button>
		</div>
	);
};

export default Upload;
