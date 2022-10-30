const fs = require('fs');
const path = require('path');

class FileController {
	async upload(req, res) {
		console.log('file', req.file);
		console.log('body', req.body);
		return res.status(200).json({ message: req.file });
	}

	async savePersistent(req, res) {
		const file = req.body.file;
		fs.rename(
			path.join(__dirname, '..', 'public', 'images', 'tmp', file),
			path.join(__dirname, '..', 'public', 'images', file),
			(e) => console.log('completed', e),
		);
		return res.status(200).send();
	}
}

module.exports = new FileController();
