const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
	{
		body: String,
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		thread: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Thread',
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Message', MessageSchema);
