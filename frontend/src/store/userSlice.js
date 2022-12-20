import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateProfileInfo = createAsyncThunk('users/updateProfileInfo', async (info) => {
	const response = await axios.post('/profile', { ...info });
	return response.data;
});

export const getUserById = createAsyncThunk('users/getUserById', async (id) => {
	const response = await axios.get(`/profile?id=${id}`);
	return response.data.user;
});

export const getUsers = createAsyncThunk('users/getUsers', async (ids) => {
	// console.log('userSlice/getUsers');
	const response = await axios.post(`/users`, { ids });
	return response.data.users;
});

export const updateFollowList = createAsyncThunk('users/updateFollowList', async (info) => {
	const response = await axios.post('/follow', { ...info });
	return response.data.user;
});

const userSlice = createSlice({
	name: 'userState',
	initialState: {
		me: null,
		users: {},
		state: 'NEVER',
	},
	reducers: {
		set_me: (state, action) => {
			state.me = action.payload;
		},
		set_users_state: (state, action) => {
			state.state = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(updateProfileInfo.fulfilled, (state, action) => {
				state.me = action.payload;
			})
			.addCase(updateFollowList.fulfilled, (state, action) => {
				state.me = action.payload;
			})
			.addCase(getUserById.fulfilled, (state, action) => {
				state.list = [...state.list, action.payload];
			})
			.addCase(getUsers.pending, (state, action) => {
				state.state = 'LOADING';
			})
			.addCase(getUsers.fulfilled, (state, action) => {
				// console.log('usersSlice/getUsers_fulfilled', action.payload);
				const newUsers = { ...state.users };
				action.payload.forEach((u) => {
					newUsers[u._id] = u;
				});
				state.users = newUsers;
				state.state = 'LOADED';
			});
	},
});

export const { set_me, set_users_state } = userSlice.actions;
export default userSlice.reducer;
