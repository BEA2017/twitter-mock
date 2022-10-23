const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		body: String,
		responseTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tweet',
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Tweet', TweetSchema);
