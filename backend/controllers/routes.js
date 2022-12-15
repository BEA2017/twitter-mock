const requireAuth = require('../utils/requireAuth');
const upload = require('../utils/uploadFiles');

const TweetController = require('./TweetController');
const UserController = require('./UserController');
const FileController = require('./FileController');
const MessageController = require('./MessageController');

const router = require('express').Router();

router.get('/me', UserController.getMe);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.post('/profile', requireAuth, UserController.updateProfileInfo);
router.get('/profile', UserController.getProfileInfo);
router.post('/users', UserController.getProfiles);

router.post('/thread', requireAuth, MessageController.requestThread.bind(MessageController));
router.get('/thread', requireAuth, MessageController.requestThreadMessages.bind(MessageController));

router.post('/message', requireAuth, MessageController.createMessage);
router.get('/messages', requireAuth, MessageController.getMessages);

router.post('/follow', requireAuth, UserController.followUser);

router.post('/upload', upload.single('image'), FileController.upload);
router.post('/save', FileController.savePersistent);

router.post('/tweet', requireAuth, TweetController.create);
router.get('/tweet', TweetController.getTweet);

router.patch('/tweet', requireAuth, TweetController.updateTweet);
router.post('/tweets', requireAuth, TweetController.getTweets);

router.post('/search', TweetController.searchTweets);

module.exports = router;
