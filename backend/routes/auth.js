const express = require('express');
const authRouter = express.Router();
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { getRedisClient } = require('../utils/redis');

const {
    loginAuthentication,
    register,
    requireAuth,
    changePassword,
    // githubLoginAuthentication,
} = require('../controllers/authController');

const redisClient = getRedisClient();

// Throttles brute-force/credential-stuffing attempts against login, and
// registration spam. Shared Redis counters so the limit holds across instances.
const authLimiter = rateLimit({
    ...(redisClient && {
        store: new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
        }),
    }),
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many attempts, please try again later.' },
});

// authRouter.post('/login/github', githubLoginAuthentication);
authRouter.post('/login', authLimiter, loginAuthentication);
authRouter.post('/register', authLimiter, register);

authRouter.put('/password', requireAuth, changePassword);

module.exports = authRouter;