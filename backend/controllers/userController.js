const User = require('../models/User');
const Post = require('../models/Post');
const Followers = require('../models/Followers');
const Following = require('../models/Following');
const ConfirmationToken = require('../models/ConfirmationToken');
const Notification = require('../models/Notification');
const socketHandler = require('../handlers/socketHandler');
const ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const crypto = require('crypto');

const {
    validateEmail,
    validateFullName,
    validateUsername,
    validateBio,
    validateWebsite,
} = require('../utils/validation');
const { sendConfirmationEmail } = require('../utils/controllerUtils');

module.exports.retrieveUser = async (req, res, next) => {
    const { username } = req.params;
    const requestingUser = res.locals.user;
    try {
        const user = await User.findOne(
            { username },
            'username fullName avatar bio bookmarks fullName _id website'
        );
        if (!user) {
            return res
                .status(404)
                .send({ error: 'Could not find a user with that username.' });
        }

        const posts = await Post.aggregate([
            {
                $facet: {
                    data: [
                        { $match: { author: new ObjectId(user._id) } },
                        { $sort: { date: -1 } },
                        { $limit: 12 },
                        {
                            $lookup: {
                                from: 'postvotes',
                                localField: '_id',
                                foreignField: 'post',
                                as: 'postvotes',
                            },
                        },
                        {
                            $lookup: {
                                from: 'comments',
                                localField: '_id',
                                foreignField: 'post',
                                as: 'comments',
                            },
                        },
                        {
                            $lookup: {
                                from: 'commentreplies',
                                localField: 'comments._id',
                                foreignField: 'parentComment',
                                as: 'commentReplies',
                            },
                        },
                        {
                            $unwind: '$postvotes',
                        },
                        {
                            $addFields: { image: '$thumbnail' },
                        },
                        {
                            $project: {
                                user: true,
                                followers: true,
                                following: true,
                                comments: {
                                    $sum: [{ $size: '$comments' }, { $size: '$commentReplies' }],
                                },
                                image: true,
                                thumbnail: true,
                                filter: true,
                                caption: true,
                                author: true,
                                postVotes: { $size: '$postvotes.votes' },
                            },
                        },
                    ],
                    postCount: [
                        { $match: { author: new ObjectId(user._id) } },
                        { $count: 'postCount' },
                    ],
                },
            },
            { $unwind: '$postCount' },
            {
                $project: {
                    data: true,
                    postCount: '$postCount.postCount',
                },
            },
        ]);

        const followersDocument = await Followers.findOne({
            user: new ObjectId(user._id),
        });

        const followingDocument = await Following.findOne({
            user: new ObjectId(user._id),
        });

        return res.send({
            user,
            followers: followersDocument.followers.length,
            following: followingDocument.following.length,
            // Check if the requesting user follows the retrieved user
            isFollowing: requestingUser
                ? !!followersDocument.followers.find(
                    (follower) => String(follower.user) === String(requestingUser._id)
                )
                : false,
            posts: posts[0],
        });
    } catch (err) {
        next(err);
    }
};

module.exports.retrievePosts = async (req, res, next) => {
    // Retrieve a user's posts with the post's comments & likes
    const { username, offset = 0 } = req.params;
    try {
        const posts = await Post.aggregate([
            { $sort: { date: -1 } },
            { $skip: Number(offset) },
            { $limit: 12 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $match: { 'user.username': username } },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments',
                },
            },
            {
                $lookup: {
                    from: 'postvotes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'postVotes',
                },
            },
            { $unwind: '$postVotes' },
            {
                $project: {
                    image: true,
                    caption: true,
                    date: true,
                    'user.username': true,
                    'user.avatar': true,
                    comments: { $size: '$comments' },
                    postVotes: { $size: '$postVotes.votes' },
                },
            },
        ]);
        if (posts.length === 0) {
            return res.status(404).send({ error: 'Could not find any posts.' });
        }
        return res.send(posts);
    } catch (err) {
        next(err);
    }
};

module.exports.bookmarkPost = async (req, res, next) => {
    const { postId } = req.params;
    const user = res.locals.user;

    try {
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ error: 'Could not find a post with that id.' });
        }

        // Check if the user has already bookmarked the post
        const hasBookmarked = await User.findOne({
            _id: user._id,
            'bookmarks.post': postId,
        });

        if (hasBookmarked) {
            // If already bookmarked, remove the bookmark
            const userRemoveBookmarkUpdate = await User.updateOne(
                { _id: user._id },
                { $pull: { bookmarks: { post: postId } } }
            );

            if (userRemoveBookmarkUpdate.modifiedCount === 0) {
                return res.status(500).send({ error: 'Could not remove the bookmark.' });
            }

            return res.send({ success: true, operation: 'remove' });
        } else {
            // If not bookmarked, add the bookmark
            const userBookmarkUpdate = await User.updateOne(
                { _id: user._id },
                { $push: { bookmarks: { post: postId } } }
            );

            if (userBookmarkUpdate.modifiedCount === 0) {
                return res.status(500).send({ error: 'Could not add the bookmark.' });
            }

            return res.send({ success: true, operation: 'add' });
        }
    } catch (err) {
        next(err);
    }
};


module.exports.followUser = async (req, res, next) => {
    const { userId } = req.params;
    const user = res.locals.user;

    try {
        // Check if the user to follow exists
        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Check if the current user is already following the target user
        const followers = await Followers.findOne({ user: userId });
        const isAlreadyFollower = followers && followers.followers.some(follower => String(follower.user) === String(user._id));

        if (isAlreadyFollower) {
            // Unfollow the user
            const followerUnfollowUpdate = await Followers.updateOne(
                { user: userId },
                { $pull: { followers: { user: user._id } } }
            );
            const followingUnfollowUpdate = await Following.updateOne(
                { user: user._id },
                { $pull: { following: { user: userId } } }
            );

            if (followerUnfollowUpdate.modifiedCount === 0 || followingUnfollowUpdate.modifiedCount === 0) {
                return res.status(500).send({ error: 'Could not unfollow user. Please try again later.' });
            }

            return res.send({ success: true, operation: 'unfollow' });
        } else {
            // Follow the user
            const followerUpdate = await Followers.updateOne(
                { user: userId },
                { $push: { followers: { user: user._id } } },
                { upsert: true }
            );

            const followingUpdate = await Following.updateOne(
                { user: user._id },
                { $push: { following: { user: userId } } },
                { upsert: true }
            );

            if (followerUpdate.modifiedCount === 0 || followingUpdate.modifiedCount === 0) {
                return res.status(500).send({ error: 'Could not follow user. Please try again later.' });
            }

            // Send a follow notification if the user is not following themselves
            if (String(userId) !== String(user._id)) {
                const notification = new Notification({
                    notificationType: 'follow',
                    sender: user._id,
                    receiver: userId,
                    date: Date.now(),
                });

                await notification.save();

                const senderData = await User.findById(user._id, 'username avatar');
                socketHandler.sendNotification({
                    notificationType: 'follow',
                    sender: {
                        _id: senderData._id,
                        username: senderData.username,
                        avatar: senderData.avatar,
                    },
                    receiver: userId,
                    date: notification.date,
                });
            }

            return res.send({ success: true, operation: 'follow' });
        }
    } catch (err) {
        next(err);
    }
};


/**
 * Retrieves either who a specific user follows or who is following the user.
 * Also retrieves whether the requesting user is following the returned users
 * @function retrieveRelatedUsers
 * @param {object} user The user object passed on from other middlewares
 * @param {string} userId Id of the user to be used in the query
 * @param {number} offset The offset for how many documents to skip
 * @param {boolean} followers Whether to query who is following the user or who the user follows default is the latter
 * @returns {array} Array of users
 */
const retrieveRelatedUsers = async (user, userId, offset, followers) => {
    const pipeline = [
        {
            $match: { user: new ObjectId(userId) },
        },
        {
            $lookup: {
                from: 'users',
                let: followers
                    ? { userId: '$followers.user' }
                    : { userId: '$following.user' },
                pipeline: [
                    {
                        $match: {
                            // Using the $in operator instead of the $eq
                            // operator because we can't coerce the types
                            $expr: { $in: ['$_id', '$$userId'] },
                        },
                    },
                    {
                        $skip: Number(offset),
                    },
                    {
                        $limit: 10,
                    },
                ],
                as: 'users',
            },
        },
        {
            $lookup: {
                from: 'followers',
                localField: 'users._id',
                foreignField: 'user',
                as: 'userFollowers',
            },
        },
        {
            $project: {
                'users._id': true,
                'users.username': true,
                'users.avatar': true,
                'users.fullName': true,
                userFollowers: true,
            },
        },
    ];

    const aggregation = followers
        ? await Followers.aggregate(pipeline)
        : await Following.aggregate(pipeline);

    // Make a set to store the IDs of the followed users
    const followedUsers = new Set();
    // Loop through every follower and add the id to the set if the user's id is in the array
    aggregation[0].userFollowers.forEach((followingUser) => {
        if (
            !!followingUser.followers.find(
                (follower) => String(follower.user) === String(user._id)
            )
        ) {
            followedUsers.add(String(followingUser.user));
        }
    });
    // Add the isFollowing key to the following object with a value
    // depending on the outcome of the loop above
    aggregation[0].users.forEach((followingUser) => {
        followingUser.isFollowing = followedUsers.has(String(followingUser._id));
    });

    return aggregation[0].users;
};

module.exports.retrieveFollowing = async (req, res, next) => {
    const { userId, offset = 0 } = req.params;
    const user = res.locals.user;
    try {
        const users = await retrieveRelatedUsers(user, userId, offset);
        return res.send(users);
    } catch (err) {
        next(err);
    }
};

module.exports.retrieveFollowers = async (req, res, next) => {
    const { userId, offset = 0 } = req.params;
    const user = res.locals.user;

    try {
        const users = await retrieveRelatedUsers(user, userId, offset, true);
        return res.send(users);
    } catch (err) {
        next(err);
    }
};

module.exports.searchUsers = async (req, res, next) => {
    const { username, offset = 0 } = req.params;
    if (!username) {
        return res
            .status(400)
            .send({ error: 'Please provide a user to search for.' });
    }

    try {
        const users = await User.aggregate([
            {
                $match: {
                    username: { $regex: new RegExp(username), $options: 'i' },
                },
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'followers',
                },
            },
            {
                $unwind: '$followers',
            },
            {
                $addFields: {
                    followersCount: { $size: '$followers.followers' },
                },
            },
            {
                $sort: { followersCount: -1 },
            },
            {
                $skip: Number(offset),
            },
            {
                $limit: 10,
            },
            {
                $project: {
                    _id: true,
                    username: true,
                    avatar: true,
                    fullName: true,
                },
            },
        ]);
        if (users.length === 0) {
            return res
                .status(404)
                .send({ error: 'Could not find any users matching the criteria.' });
        }
        return res.send(users);
    } catch (err) {
        next(err);
    }
};

module.exports.confirmUser = async (req, res, next) => {
    const { token } = req.body;
    const user = res.locals.user;

    try {
        const confirmationToken = await ConfirmationToken.findOne({
            token,
            user: user._id,
        });
        if (!confirmationToken) {
            return res
                .status(404)
                .send({ error: 'Invalid or expired confirmation link.' });
        }
        await ConfirmationToken.deleteOne({ token, user: user._id });
        await User.updateOne({ _id: user._id }, { confirmed: true });
        return res.send();
    } catch (err) {
        next(err);
    }
};

module.exports.changeAvatar = async (req, res, next) => {
    const user = res.locals.user;

    if (!req.file) {
        return res.status(400).send({ error: 'Please provide the image to upload.' });
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(req.file.path, {
            width: 200,
            height: 200,
            gravity: 'face',
            crop: 'thumb',
        });

        // Delete the file from the server after uploading
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
        });

        // Update user's avatar URL
        const userUpdate = await User.findByIdAndUpdate(
            user._id,
            { avatar: response.secure_url },
            { new: true }
        );

        if (!userUpdate) {
            throw new Error('Could not update user avatar.');
        }

        return res.send({ avatar: userUpdate.avatar });
    } catch (err) {
        next(err);
    }
};

module.exports.removeAvatar = async (req, res, next) => {
    const user = res.locals.user;

    try {
        const avatarUpdate = await User.findByIdAndUpdate(
            user._id,
            { $unset: { avatar: "" } },
            { new: true }
        );

        if (!avatarUpdate) {
            return res.status(500).send({ error: 'Could not remove avatar.' });
        }

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};


module.exports.updateProfile = async (req, res, next) => {
    const user = res.locals.user;
    const { fullName, username, website, bio, email } = req.body;
    let confirmationToken = undefined;
    let updatedFields = {};
    try {
        const userDocument = await User.findOne({ _id: user._id });

        if (fullName) {
            const fullNameError = validateFullName(fullName);
            if (fullNameError) return res.status(400).send({ error: fullNameError });
            userDocument.fullName = fullName;
            updatedFields.fullName = fullName;
        }

        if (username) {
            const usernameError = validateUsername(username);
            if (usernameError) return res.status(400).send({ error: usernameError });
            // Make sure the username to update to is not the current one
            if (username !== user.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser)
                    return res
                        .status(400)
                        .send({ error: 'Please choose another username.' });
                userDocument.username = username;
                updatedFields.username = username;
            }
        }

        if (website) {
            const websiteError = validateWebsite(website);
            if (websiteError) return res.status(400).send({ error: websiteError });
            if (!website.includes('http://') && !website.includes('https://')) {
                userDocument.website = 'https://' + website;
                updatedFields.website = 'https://' + website;
            } else {
                userDocument.website = website;
                updatedFields.website = website;
            }
        }

        if (bio) {
            const bioError = validateBio(bio);
            if (bioError) return res.status(400).send({ error: bioError });
            userDocument.bio = bio;
            updatedFields.bio = bio;
        }

        if (email) {
            const emailError = validateEmail(email);
            if (emailError) return res.status(400).send({ error: emailError });
            // Make sure the email to update to is not the current one
            if (email !== user.email) {
                const existingUser = await User.findOne({ email });
                if (existingUser)
                    return res
                        .status(400)
                        .send({ error: 'Please choose another email.' });
                confirmationToken = new ConfirmationToken({
                    user: user._id,
                    token: crypto.randomBytes(20).toString('hex'),
                });
                await confirmationToken.save();
                userDocument.email = email;
                userDocument.confirmed = false;
                updatedFields = { ...updatedFields, email, confirmed: false };
            }
        }
        const updatedUser = await userDocument.save();
        res.send(updatedFields);
        if (email && email !== user.email) {
            sendConfirmationEmail(
                updatedUser.username,
                updatedUser.email,
                confirmationToken.token
            );
        }
    } catch (err) {
        next(err);
    }
};

module.exports.retrieveSuggestedUsers = async (req, res, next) => {
    const { max } = req.params;
    const user = res.locals.user;
    try {
        const users = await User.aggregate([
            {
                $match: { _id: { $ne: new ObjectId(user._id) } },
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'followers',
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$author', '$$userId'],
                                },
                            },
                        },
                        {
                            $sort: { date: -1 },
                        },
                        {
                            $limit: 3,
                        },
                    ],
                    as: 'posts',
                },
            },
            {
                $unwind: '$followers',
            },
            {
                $project: {
                    username: true,
                    fullName: true,
                    email: true,
                    avatar: true,
                    isFollowing: { $in: [user._id, '$followers.followers.user'] },
                    posts: true,
                },
            },
            {
                $match: { isFollowing: false },
            },
            {
                $sample: { size: max ? Number(max) : 20 },
            },
            {
                $sort: { posts: -1 },
            },
            {
                $unset: ['isFollowing'],
            },
        ]);
        res.send(users);
    } catch (err) {
        next(err);
    }
};