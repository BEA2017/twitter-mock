import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { clear_search_results } from '../store/tweetsSlice';

const useSearch = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');

	const handleSearch = () => {
		setSearchQuery('');
		dispatch(clear_search_results());
		navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
	};

	const onChangeInput = (e) => {
		setSearchQuery(e.target.value);
	};

	return { searchQuery, handleSearch, onChangeInput };
};

export default useSearch;
