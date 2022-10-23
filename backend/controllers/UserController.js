const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
	async getMe(req, res) {
		const token = req.cookies['token'];
		try {
			const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({ _id: decodedToken.userId });
			return res.status(200).json({ user });
		} catch (e) {
			console.log(e);
			return;
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
}

module.exports = new UserController();
