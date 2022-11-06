const Message = require('../models/Message');
const Thread = require('../models/Thread');
const User = require('../models/User');

class MessageController {
	async requestThread(req, res) {
		const { request } = req.body;
		switch (request) {
			case 'getByLogins':
				this.getThreadByLogins(req, res);
				break;
			case 'getByLogin':
				this.getThreadsByLogin(req, res);
				break;
			case 'create':
				this.createThread(req, res);
				break;
		}
	}

	async requestThreadMessages(req, res) {
		const threadId = req.query.threadId;
		const messages = await Message.find({ thread: threadId })
			.sort({ createdAt: 1 })
			.populate('author');
		return res.status(200).json({ messages });
	}

	async createThread(req, res) {
		let participantsLogin = req.body.participants;
		let thread = await this.queryThreadByLogins(participantsLogin, req);
		if (!thread) {
			thread = new Thread({
				participants: req.participantsId,
			});
			await thread.save();
		}
		return res.status(200).json({ thread });
	}

	async getThreadByLogins(req, res) {
		let participantsLogin = req.body.participants;
		let thread = await this.queryThreadByLogins(participantsLogin, req);
		return res.status(200).json({ thread });
	}

	async queryThreadByLogins(logins, req) {
		let participantsId = await Promise.all(
			logins.map(async (login) => {
				const user = await User.findOne({ login });
				return user._id;
			}),
		);
		req.participantsId = participantsId;
		let thread = await Thread.findOne({
			$and: [
				{
					participants: { $all: participantsId },
				},
				{
					participants: { $size: participantsId.length },
				},
			],
		});
		return thread;
	}

	async getThreadsByLogin(req, res) {
		let login = req.body.login;
		const user = await User.findOne({ login });
		const userId = user._id;

		let threads = await Thread.find({
			participants: { $in: userId },
		}).populate('participants');
		return res.status(200).json({ threads });
	}

	async createMessage(req, res) {
		const { author, thread, body } = req.body;
		const message = new Message({ author, thread, body });
		await message.save();
		return res.status(200).send();
	}

	async getMessages(req, res) {
		const { thread } = req.query;
		const messages = await Message.find({ thread }).sort({ createdAt: 1 }).populate('author');
		return res.status(200).json({ messages });
	}
}

module.exports = new MessageController();
