const requireAuth = require('../utils/requireAuth');
const upload = require('../utils/uploadFiles');

const TweetController = require('./TweetController');
const UserController = require('./UserController');

const router = require('express').Router();

router.get('/me', UserController.getMe);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/upload', upload.single('avatar'), UserController.upload);

router.post('/tweet', requireAuth, TweetController.create);
router.get('/tweets', requireAuth, TweetController.getTweets);

module.exports = router;
