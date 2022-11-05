const Message = require('../models/Message');
const Thread = require('../models/Thread');
const User = require('../models/User');

class MessageController {
	async requestThread(req, res) {
		const { request } = req.body;
		switch (request) {
			case 'get':
				this.getThread(req, res);
				break;
			case 'create':
				this.createThread(req, res);
				break;
		}
	}

	async getThread(req, res) {
		let participantsLogin = req.body.participants;
		const thread = await this.isThreadExists(participantsLogin);
		return res.status(200).json({ thread });
	}

	async createThread(req, res) {
		let participantsLogin = req.body.participants;
		const thread = await this.isThreadExists(participantsLogin);
		if (!thread) {
			thread = new Thread({
				participants: participantsId,
			});
			await thread.save();
		}
		return res.status(200).json({ thread });
	}

	async isThreadExists(participantsLogin) {
		let participantsId = await Promise.all(
			participantsLogin.map(async (login) => {
				const user = await User.findOne({ login });
				return user._id;
			}),
		);
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

	async createMessage(req, res) {
		const { author, thread, body } = req.body;
		const message = new Message({ author, thread, body });
		await message.save();
		return res.status(200).send();
	}

	async getMessages(req, res) {
		const { thread } = req.query;
		const messages = await Message.find({ thread }).sort({ createdAt: -1 }).populate('author');
		return res.status(200).json({ messages });
	}
}

module.exports = new MessageController();
