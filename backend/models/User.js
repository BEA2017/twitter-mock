const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	login: String,
	name: String,
	surname: String,
	avatar: String,
	about: String,
	city: String,
	webpage: String,
	email: String,
	password: String,
	confirmHash: String,
	confirmed: Boolean,
	subscriptions: { type: [mongoose.Types.ObjectId], ref: 'User', default: [] },
});

module.exports = new mongoose.model('User', UserSchema);
