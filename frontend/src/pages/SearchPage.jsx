import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/Utils/BackButton';
import Spinner from '../components/Layout/Spinner';
import Tweet from '../components/Tweets/Tweet';
import useTweetsLoader from '../utils/useTweetsLoader';
import { useEffect } from 'react';
import useSearch from '../utils/useSearch';
import { SearchOutlined } from '@ant-design/icons';

const SearchPage = () => {
	const [params, setParams] = useSearchParams();
	const query = params.get('q');
	const { tweets, state } = useTweetsLoader({ request: { type: 'SEARCH', searchQuery: query } });
	const { handleSearch, searchQuery, onChangeInput } = useSearch();

	useEffect(() => {
		const hidden = document.querySelector('.right-sidebar_header');
		hidden.style.display = 'none';
		console.log('SearchPage/useEffect:statrt');
		return () => {
			hidden.style.removeProperty('display');
			console.log('SearchPage/useEffect:finish');
		};
	}, []);

	return (
		<>
			<BackButton />
			<div className="serach-page_container">
				{/* <div className="search_header">
					<input
						type={'text'}
						className={'right-sidebar_search'}
						placeholder={'Поиск по твиттеру'}
						value={searchQuery}
						onChange={onChangeInput}
					/>
					<SearchOutlined onClick={handleSearch} className="right-sidebar_search-icon" />
				</div> */}
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
