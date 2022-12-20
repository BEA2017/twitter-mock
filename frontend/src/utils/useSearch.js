import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { clear_search_results } from '../store/tweetsSlice';
import useTweetsLoader from './useTweetsLoader';

const useSearch = (request, cb) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { tweets, state, startLoading } = useTweetsLoader({
		request: {
			type: 'SEARCH',
			searchQuery: request.queryText,
			searchType: request.queryType,
		},
	});

	const handleSearch = useCallback(() => {
		startLoading();
		dispatch(clear_search_results());
		navigate(`/search?q=${encodeURIComponent(request.queryText)}`);
		cb && cb();
	}, [request.queryText]);

	return { handleSearch, tweets, state, startLoading };
};

export default useSearch;
