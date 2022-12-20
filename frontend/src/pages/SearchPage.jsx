import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/Utils/BackButton';
import Spinner from '../components/Layout/Spinner';
import Tweet from '../components/Tweets/Tweet';
import { useEffect } from 'react';
import useSearch from '../utils/useSearch';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clear_search_results } from '../store/tweetsSlice';

const SearchPage = () => {
	const [params, setParams] = useSearchParams();
	const query = params.get('q');
	const [userInput, setUserInput] = useState(query);
	const [activeController, setActiveController] = useState(0);
	const dispatch = useDispatch();
	const controllers = {
		TOP: 'Топ',
		LAST: 'Последнее',
		PEOPLE: 'Люди',
		IMAGES: 'Изображения',
		VIDEO: 'Видео',
	};
	const { handleSearch, tweets, state, startLoading } = useSearch({
		queryText: userInput,
		queryType: Object.keys(controllers)[activeController],
	});

	useEffect(() => {
		const hidden = document.querySelector('.right-sidebar_header');
		hidden.style.display = 'none';
		return () => {
			hidden.style.removeProperty('display');
		};
	}, []);

	const onClickController = (index) => {
		startLoading();
		dispatch(clear_search_results());
		setActiveController(index);
	};

	return (
		<>
			<div className="serach-page_container">
				<div className="search_sticky">
					<div className="search_header">
						<BackButton simple />
						<div className="search_input-container">
							<input
								type={'text'}
								className={'search_input'}
								placeholder={'Поиск по твиттеру'}
								value={userInput}
								onChange={(e) => setUserInput(e.target.value)}
							/>
							<SearchOutlined onClick={handleSearch} className="search_input-icon" />
						</div>
						<div className="hidden"></div>
					</div>
					<div className="search_controllers">
						{Object.values(controllers).map((i, idx) => {
							return (
								<div
									key={idx}
									onClick={() => onClickController(idx)}
									className={`search_controllers-item ${
										idx === activeController && 'search_controllers-item-active'
									}`}>
									{i}
								</div>
							);
						})}
					</div>
				</div>
				{state === 'LOADING' ? (
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
