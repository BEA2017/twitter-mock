const Tweet = require('../models/Tweet');

class TweetController {
	async create(req, res) {
		const data = req.body;
		console.log(data);
		const tweet = new Tweet({ body: data.body, user: req.userId, responseTo: data.responseTo });
		await tweet.save();
		return res.status(201).json({ tweet });
	}

	async getTweets(req, res) {
		const tweets = await Tweet.find({}).populate('user');
		const newTweets = await Promise.all(
			tweets.map(async (t) => {
				const replies = await Tweet.find({ responseTo: t._id }).populate('user');
				const tweetWithReplies = { ...t._doc, replies };
				return tweetWithReplies;
			}),
		);
		return res.status(200).json({ tweets: newTweets });
	}
}

module.exports = new TweetController();
