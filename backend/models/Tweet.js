const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		body: String,
		retweetBody: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tweet',
		},
		attachment: String,
		type: {
			type: String,
			enum: ['Tweet', 'Retweet', 'Reply'],
		},
		retweettedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		likedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		parentTweet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tweet',
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Tweet', TweetSchema);
