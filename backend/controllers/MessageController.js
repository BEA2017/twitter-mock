class MessageController {
	async createThread(req, res) {
		console.log('createThread', req.body);
		res.status(200).send();
	}

	async createMessage(req, res) {
		const { author, thread, body } = req.body;
	}
}

module.exports = new MessageController();
