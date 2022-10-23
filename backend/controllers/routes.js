const requireAuth = require('../utils/requireAuth');
const TweetController = require('./TweetController');
const UserController = require('./UserController');

const router = require('express').Router();

router.get('/me', UserController.getMe);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.post('/tweet', requireAuth, TweetController.create);
router.get('/tweets', requireAuth, TweetController.getTweets);

module.exports = router;
