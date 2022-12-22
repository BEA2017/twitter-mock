import axios from 'axios';
import { useEffect, useState } from 'react';
import { useStore } from 'react-redux';

const useRecommendationsLoader = () => {
	const [users, setUsers] = useState([]);
	const [themes, setThemes] = useState([]);
	const { getState } = useStore();

	useEffect(() => {
		const getUserRecommendations = async () => {
			const subsRecom = await axios.post('topusers', {
				subscriptions: getState().users.me.subscriptions,
			});
			setUsers(subsRecom.data.array);
		};
		getUserRecommendations();
	}, []);

	return { users, themes };
};

export default useRecommendationsLoader;
