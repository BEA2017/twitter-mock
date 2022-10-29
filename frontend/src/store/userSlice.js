import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateProfileInfo = createAsyncThunk('users/updateProfileInfo', async (info) => {
	const response = await axios.post('/profile', { ...info });
	return response.data;
});

export const updateFollowList = createAsyncThunk('users/updateFollowList', async (info) => {
	const response = await axios.post('/follow', { ...info });
	return response.data.user;
});

const userSlice = createSlice({
	name: 'userState',
	initialState: {
		me: null,
	},
	reducers: {
		set_me: (state, action) => {
			state.me = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(updateProfileInfo.fulfilled, (state, action) => {
				state.me = action.payload;
			})
			.addCase(updateFollowList.fulfilled, (state, action) => {
				state.me = action.payload;
			});
	},
});

export const { set_me } = userSlice.actions;
export default userSlice.reducer;
