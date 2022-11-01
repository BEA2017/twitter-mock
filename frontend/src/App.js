import { Routes, Route, Navigate } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import StartingPage from './pages/StartingPage';
import Home from './pages/Home';
import TweetsList from './pages/TweetsList';
import SelectedTweet from './pages/SelectedTweet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { set_me } from './store/userSlice';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Spinner from './components/Spinner';
import SearchPage from './pages/SearchPage';

function App() {
	const loggedUser = useSelector((state) => state.users.me);
	const [isInitialized, setIsInitialized] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		axios
			.get('/me')
			.then((res) => {
				console.log('init', res);
				setIsInitialized(true);
				dispatch(set_me(res.data.user));
			})
			.catch((e) => setIsInitialized(true));
	}, []);

	if (!isInitialized) return <Spinner />;

	return (
		<div className="App">
			<BrowserRouter>
				{loggedUser ? (
					<Routes>
						<Route path="/" element={<Home />}>
							<Route index element={<TweetsList />} />
							<Route path={'tweets/:id'} element={<SelectedTweet />} />
							<Route path={'/search'} element={<SearchPage />} />
							<Route path={'/:profile'} element={<Profile />} />
						</Route>
						{['/login', '*'].map((path, idx) => (
							<Route key={idx} path={path} element={<Navigate replace to={'/'} />} />
						))}
					</Routes>
				) : (
					<Routes>
						<Route path="/login" element={<StartingPage />} />
						<Route path="/upload" element={<Upload />} />
						<Route path="*" element={<Navigate replace to={'/login'} />} />
					</Routes>
				)}
			</BrowserRouter>
		</div>
	);
}

export default App;
