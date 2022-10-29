const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
	async getMe(req, res) {
		const token = req.cookies['token'];
		if (!token) return res.status(302).send();
		try {
			const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({ _id: decodedToken.userId });
			return res.status(200).json({ user });
		} catch (e) {
			return res.status(400).send();
		}
	}

	async getProfileInfo(req, res) {
		const data = req.query;
		try {
			const user = await User.findOne(
				{ login: data.login },
				'_id name surname login about avatar city webpage subscriptions',
			);
			console.log('result', user);
			const subscribers = await User.count({ subscriptions: { $in: user._id } });
			return res.status(200).json({ user: { ...user._doc, subscribers } });
		} catch (e) {
			return e;
		}
	}

	async register(req, res) {
		const data = req.body;
		const existed = await User.findOne({ login: data.login });
		if (existed) return res.status(400).json({ message: 'This login already in use' });
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = await bcrypt.hashSync(data.password, salt);
		const user = new User({ ...data, password: hashedPassword, confirmed: false });
		await user.save();
		res.status(201).json({ message: 'user created' });
	}

	async login(req, res) {
		const data = req.body;
		const existed = await User.findOne({ login: data.login });
		if (!existed) return res.status(400).json({ message: 'Incorrect credentials' });
		const validationSuccess = await bcrypt.compareSync(data.password, existed.password);
		if (!validationSuccess) return res.status(400).json({ message: 'Incorrect credentials' });
		const token = jwt.sign({ userId: existed._id }, process.env.JWT_SECRET);
		res.cookie('token', token, { httpOnly: true });
		res.status(200).json({ user: existed });
	}

	async upload(req, res) {
		console.log('file', req.file);
		console.log('body', req.body);
		return res.status(200).json({ message: req.file });
	}

	async updateProfileInfo(req, res) {
		const data = req.body;
		await User.updateOne({ _id: req.userId }, { ...data });
		const newProfileInfo = await User.findOne({ _id: req.userId });
		return res.status(200).send(newProfileInfo);
	}

	async followUser(req, res) {
		const { type, followId } = req.body;
		const me = await User.findOne({ _id: req.userId });
		let newSubscriptions;
		if (type == 'follow') {
			newSubscriptions = [...me.subscriptions, followId];
			console.log('follow', newSubscriptions);
		}
		if (type == 'unfollow') {
			newSubscriptions = me.subscriptions.filter((id) => id.toString() !== followId);
			console.log('unfollow', newSubscriptions);
		}
		await User.updateOne({ _id: req.userId }, { subscriptions: newSubscriptions });
		const user = await User.findOne({ _id: req.userId });
		return res.status(200).json({ user });
	}
}

module.exports = new UserController();