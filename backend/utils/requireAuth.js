const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
	const token = req.cookies['token'];
	try {
		tokenData = await jwt.verify(token, process.env.JWT_SECRET);
		req.userId = tokenData.userId;
		next();
	} catch (e) {
		// console.log(e);
		return;
	}
};

module.exports = requireAuth;
