const express = require('express');
const postRouter = express.Router();
const multer = require('multer');
const upload = multer({
    dest: 'temp/',
    limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { getRedisClient } = require('../utils/redis');

const { requireAuth } = require('../controllers/authController');
const {
    createPost,
    retrievePost,
    votePost,
    deletePost,
    retrievePostFeed,
    retrieveSuggestedPosts,
    retrieveHashtagPosts,
} = require('../controllers/postController');
const filters = require('../utils/filters');

const redisClient = getRedisClient();

const postLimiter = rateLimit({
    // Shared counters so the limit holds across all backend instances
    ...(redisClient && {
        store: new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
        }),
    }),
    windowMs: 15 * 60 * 1000,
    max: 5,
    // Failed uploads (4xx/5xx) shouldn't use up the user's quota
    skipFailedRequests: true,
    message: { error: 'Too many posts created, please try again later.' },
});

postRouter.post('/', postLimiter, requireAuth, upload, createPost);
postRouter.post('/:postId/vote', requireAuth, votePost);

postRouter.get('/suggested/:offset', requireAuth, retrieveSuggestedPosts);
postRouter.get('/filters', (req, res) => {
    res.send({ filters });
});
postRouter.get('/:postId', retrievePost);
postRouter.get('/feed/:offset', requireAuth, retrievePostFeed);
postRouter.get('/hashtag/:hashtag/:offset', requireAuth, retrieveHashtagPosts);

postRouter.delete('/:postId', requireAuth, deletePost);

module.exports = postRouter;