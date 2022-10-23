import { createSlice } from '@reduxjs/toolkit';

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
});

export const { set_me } = userSlice.actions;
export default userSlice.reducer;
