import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import Tweet from '../components/Tweet';

const SearchPage = () => {
	const [params, setParams] = useSearchParams();
	const query = params.get('q');
	const [tweets, setTweets] = useState([]);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		setIsInitialized(false);
		const search = async () => {
			const response = await axios.post('/search', { query });
			setTweets(response.data.result);
			setIsInitialized(true);
		};
		search();
	}, [query]);

	return (
		<>
			<BackButton />
			<div className="serach-page_container">
				<h3>Результаты поиска: {query}</h3>
				{!isInitialized ? (
					<Spinner />
				) : tweets.length > 0 ? (
					tweets.map((t, idx) => <Tweet key={idx} tweet={t} query={query} />)
				) : (
					'Твиты не найдены'
				)}
			</div>
		</>
	);
};

export default SearchPage;
