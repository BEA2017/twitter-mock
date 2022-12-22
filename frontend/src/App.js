import { Routes, Route, Navigate } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import StartingPage from './pages/SignIn';
import Home from './pages/Home';
import SelectedTweet from './pages/SelectedTweet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { set_me } from './store/userSlice';
import Profile from './pages/Profile';
import Spinner from './components/Layout/Spinner';
import SearchPage from './pages/SearchPage';
import Messenger from './pages/Messenger';
import { connectSocket } from './store/sockets';
import Feed from './pages/Feed';

function App() {
	const loggedUser = useSelector((state) => state.users.me);
	const [isInitialized, setIsInitialized] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		axios
			.get('/me')
			.then((res) => {
				setIsInitialized(true);
				connectSocket(res.data.user);
				dispatch(set_me(res.data.user));
			})
			.catch((e) => setIsInitialized(true));
	}, []);

	if (!isInitialized) return <Spinner />;

	console.log('App/me', loggedUser);

	return (
		<div className="App">
			<BrowserRouter>
				{loggedUser ? (
					<Routes>
						<Route path="/" element={<Home />}>
							<Route index element={<Feed me={loggedUser} />} />
							<Route path={'tweets/:id'} element={<SelectedTweet />} />
							<Route path={'/search'} element={<SearchPage />} />
							<Route path={'/:profile'} element={<Profile />} />
						</Route>
						<Route path={'/im'} element={<Messenger />} />
						<Route path={'/im?sel=:login'} element={<Messenger />} />
						{['/login', '*'].map((path, idx) => (
							<Route key={idx} path={path} element={<Navigate replace to={'/'} />} />
						))}
					</Routes>
				) : (
					<Routes>
						<Route path="/login" element={<StartingPage />} />
						<Route path="*" element={<Navigate replace to={'/login'} />} />
					</Routes>
				)}
			</BrowserRouter>
		</div>
	);
}

export default App;
