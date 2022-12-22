const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
	async getMe(req, res) {
		const token = req.cookies['token'];
		if (!token) return res.status(302).send();
		try {
			const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({ _id: decodedToken.userId }).populate({
				path: 'subscriptions',
				select: ['_id', 'login', 'name', 'surname', 'avatar'],
			});
			return res.status(200).json({ user });
		} catch (e) {
			return res.status(400).send();
		}
	}

	async getProfileInfo(req, res) {
		const { login, id } = req.query;
		try {
			const query = login ? { login } : { _id: id };
			const user = await User.findOne(
				query,
				'_id name surname login about avatar city webpage subscriptions',
			);
			const subscribers = await User.count({ subscriptions: { $in: user._id } });
			return res.status(200).json({ user: { ...user._doc, subscribers } });
		} catch (e) {
			return e;
		}
	}

	async _getProfiles(ids) {
		console.log('_getProfiles/ids', ids);
		const users = await Promise.all(
			ids.map(async (id) => {
				return await User.findOne(
					{ _id: id },
					'_id name surname login about avatar city webpage subscriptions',
				);
			}),
		);

		return users;
	}

	async getProfiles(req, res) {
		const { ids } = req.body;

		try {
			const users = await this._getProfiles(ids);
			return res.status(200).json({ users });
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getTopUsers(req, res) {
		// [id1,id2,...]
		const subsArr = req.body.subscriptions.map((obj) => obj._id);
		// for O(1) search
		const subsObj = {};

		console.log('UserController/getTopUsers_my id', req.userId);

		subsArr.forEach((id) => (subsObj[id] = id));

		// [ [_id:u1, subscriptions: [u3, u5,...]], [_id:u2, subscriptions: [...]], [...] ]
		let array = await User.find({ subscriptions: { $exists: true, $ne: [] } }, 'subscriptions');
		const userIds = [];
		array = array.map((e) => e.subscriptions).forEach((arr) => userIds.push(...arr));
		const myId = req.userId;
		//filter ids included in my subscriptions list
		array = userIds.filter((id) => id.toString() !== myId && !subsObj[id]);

		const subscribersQty = {};
		array.forEach((id) => (subscribersQty[id] = subscribersQty[id] + 1 || 1));

		let result = Object.entries(subscribersQty)
			.sort(([aId, aSubs], [bId, bSubs]) => bSubs - aSubs)
			.slice(0, 16);

		result = await this._getProfiles(result.map(([id, count]) => id));

		return res.status(200).json({ array: result });
	}

	async register(req, res) {
		const data = req.body;
		let existed = await User.findOne({ login: data.login });
		if (existed) return res.status(400).json({ message: 'Логин уже используется' });
		existed = await User.findOne({ email: data.email });
		if (existed) return res.status(400).json({ message: 'Email уже используется' });
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = await bcrypt.hashSync(data.password, salt);
		const user = new User({ ...data, password: hashedPassword, confirmed: false });
		await user.save();
		res.status(201).json({ message: 'Пользователь создан' });
	}

	async login(req, res) {
		const data = req.body;
		const existed = await User.findOne({ login: data.login }).populate('subscriptions');
		if (!existed) return res.status(400).json({ message: 'Неверные данные' });
		const validationSuccess = await bcrypt.compareSync(data.password, existed.password);
		if (!validationSuccess) return res.status(400).json({ message: 'Неверные данные' });
		const token = jwt.sign({ userId: existed._id }, process.env.JWT_SECRET);
		res.cookie('token', token, { httpOnly: true });
		res.status(200).json({ user: existed });
	}

	async updateProfileInfo(req, res) {
		const data = req.body;
		await User.updateOne({ _id: req.userId }, { ...data });
		const newProfileInfo = await User.findOne({ _id: req.userId }).populate({
			path: 'subscriptions',
			select: ['_id', 'login', 'name', 'surname', 'avatar'],
		});
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
		const user = await User.findOne({ _id: req.userId }).populate({
			path: 'subscriptions',
			select: ['_id', 'login', 'name', 'surname', 'avatar'],
		});
		return res.status(200).json({ user });
	}
}

module.exports = new UserController();
