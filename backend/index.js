require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./controllers/routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket) => {
	socket.on('new tweet', async (from) => {
		let sockets = await io.fetchSockets();
		sockets.forEach((s) => {
			let subscriptions = s.handshake.query.subscriptions.split(',');
			if (subscriptions.find((s) => s === from)) {
				s.emit('new tweet');
			}
		});
	});

	socket.on('new message', async (to) => {
		let sockets = await io.fetchSockets();
		sockets.forEach((s) => {
			let id = s.handshake.query.id;
			if (id === to) {
				console.log('socket/new message:emit');
				s.emit('new message');
			}
		});
	});
});

mongoose.connect('mongodb://localhost:27017/twitter', () => console.log('mongo connected'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use(router);

server.listen(3005);
