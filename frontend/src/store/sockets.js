import { io } from 'socket.io-client';

export let socket = null;
export const connectSocket = (user) => {
	socket = io('ws://localhost:3005', {
		query: {
			id: user._id,
			subscriptions: user.subscriptions.map((u) => u._id),
		},
	});
};
