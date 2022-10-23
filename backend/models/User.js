const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	login: String,
	name: String,
	surname: String,
	email: String,
	password: String,
	confirmHash: String,
	confirmed: Boolean,
});

module.exports = new mongoose.model('User', UserSchema);
