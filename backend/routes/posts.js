const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const newPost = new Post({
      user: req.user.id,
      content: req.body.content
    });
    const post = await newPost.save();
    const populatedPost = await Post.findById(post._id).populate('user', 'username');
    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all posts with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username')
      .populate('replies.user', 'username');

    const total = await Post.countDocuments();
    const hasMore = total > skip + posts.length;

    res.json({
      posts,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Like a post
router.post('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Unlike a post
router.post('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has not been liked by this user
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a reply to a post
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newReply = {
      user: req.user.id,
      content: req.body.content
    };

    post.replies.unshift(newReply);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username')
      .populate('replies.user', 'username');

    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;