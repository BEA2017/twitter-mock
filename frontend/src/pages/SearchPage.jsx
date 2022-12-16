import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/Utils/BackButton';
import Spinner from '../components/Layout/Spinner';
import Tweet from '../components/Tweets/Tweet';
import useTweetsLoader from '../utils/useTweetsLoader';

const SearchPage = () => {
	const [params, setParams] = useSearchParams();
	const query = params.get('q');
	const { tweets, state } = useTweetsLoader({ request: { type: 'SEARCH', searchQuery: query } });

	return (
		<>
			<BackButton />
			<div className="serach-page_container">
				<h3>Результаты поиска: {query}</h3>
				{state !== 'LOADED' ? (
					<Spinner />
				) : tweets?.length > 0 ? (
					tweets.map((t, idx) => <Tweet key={idx} tweet={t} query={query} />)
				) : (
					'Твиты не найдены'
				)}
			</div>
		</>
	);
};

export default SearchPage;
