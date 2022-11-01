const Tweet = require('../models/Tweet');

class TweetController {
	async create(req, res) {
		const data = req.body;
		console.log(data);
		const tweet = new Tweet({
			body: data.body,
			user: req.userId,
			responseTo: data.responseTo,
			attachment: data.attachment,
		});
		await tweet.save();
		return res.status(201).json({ tweet });
	}

	async getTweets(req, res) {
		const id = req.body.id;
		const tweets = await Tweet.find({ user: { $in: id } })
			.sort({ createdAt: -1 })
			.populate('user');
		const newTweets = await Promise.all(
			tweets.map(async (t) => {
				const replies = await Tweet.find({ responseTo: t._id }).populate('user');
				const tweetWithReplies = { ...t._doc, replies };
				return tweetWithReplies;
			}),
		);
		return res.status(200).json({ tweets: newTweets });
	}

	async searchTweets(req, res) {
		const searchQuery = req.body.query;
		console.log('searchQuery', searchQuery);
		const result = await Tweet.find({ body: { $regex: searchQuery, $options: 'i' } }).populate(
			'user',
		);
		res.status(200).json({ result });
	}
}

module.exports = new TweetController();
