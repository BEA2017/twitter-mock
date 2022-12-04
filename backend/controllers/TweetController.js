const Tweet = require('../models/Tweet');

class TweetController {
	async create(req, res) {
		const data = req.body;
		const tweet = new Tweet({
			body: data.body,
			retweetBody: data.retweetBody,
			user: req.userId,
			parentTweet: data.parentTweet,
			attachment: data.attachment,
			type: data.type,
		});
		await tweet.save();
		return res.status(201).json({ tweet });
	}

	async getTweets(req, res) {
		const id = req.body.id;
		const tweets = await Tweet.find({ user: { $in: id } })
			.sort({ createdAt: -1 })
			.populate('user')
			.populate({
				path: 'retweetBody',
				populate: {
					path: 'user',
				},
			});
		const newTweets = await Promise.all(
			tweets.map(async (t) => {
				const replies = await Tweet.find({
					parentTweet: t.retweetBody ? t.retweetBody._id : t._id,
				}).populate('user');
				const tweetWithReplies = { ...t._doc, replies };
				return tweetWithReplies;
			}),
		);
		return res.status(200).json({ tweets: newTweets });
	}

	async getTweet(req, res) {
		const id = req.query.id;
		const tweet = await Tweet.findById(id).populate('user');
		let parentTweet = tweet.parentTweet;
		let tree = [];
		while (parentTweet) {
			const data = await Tweet.findById(parentTweet).populate('user');
			const replies = await Tweet.find({ parentTweet: data._id });
			tree.push({ ...data._doc, user: data.user, replies });
			parentTweet = data.parentTweet;
		}
		const replies = await Tweet.find({
			parentTweet: tweet._id,
		}).populate('user');
		return res.status(200).json({ tweet, tree: tree.reverse(), replies });
	}

	async updateTweet(req, res) {
		const { id, path } = req.body;
		const me = req.userId;
		console.log('TweetController/UpdateTweet', me);
		const tweet = await Tweet.findById(id);
		if (path === 'like') {
			let exists = tweet.likedBy.find((id) => id == me);
			exists
				? (tweet.likedBy = tweet.likedBy.filter((id) => id != me))
				: (tweet.likedBy = [...tweet.likedBy, me]);
		}
		if (path === 'retweet') {
			let exists = tweet.retweettedBy.find((id) => id == me);
			if (!exists) tweet.retweettedBy.push(me);
		}
		await tweet.save();
		return res.status(200).json({ tweet });
	}

	async searchTweets(req, res) {
		const searchQuery = req.body.query;
		const result = await Tweet.find({ body: { $regex: searchQuery, $options: 'i' } }).populate(
			'user',
		);
		res.status(200).json({ result });
	}
}

module.exports = new TweetController();
