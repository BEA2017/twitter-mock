const multer = require('multer');
const path = require('node:path');

const storageConfig = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '..', 'public', 'images', 'tmp'));
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const multerFilter = (req, file, cb) => {
	if (file.mimetype.split('/')[0] === 'image') {
		cb(null, true);
	} else {
		cb(new Error('Not an image'), false);
	}
};

const upload = multer({
	storage: storageConfig,
	fileFilter: multerFilter,
});

module.exports = upload;
