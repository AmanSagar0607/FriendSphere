const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const NodeCache = require('node-cache');

const recommendationsCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Send friend request
router.post('/request/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);

    if (!friend) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (friend.friendRequests.includes(user._id)) {
      return res.status(400).json({ msg: 'Friend request already sent' });
    }

    if (friend.friends.includes(user._id)) {
      return res.status(400).json({ msg: 'You are already friends with this user' });
    }

    if (user._id.toString() === friend._id.toString()) {
      return res.status(400).json({ msg: 'You cannot send a friend request to yourself' });
    }

    friend.friendRequests.push(user._id);
    await friend.save();

    res.json({ msg: 'Friend request sent successfully' });
  } catch (err) {
    console.error('Server error in friend request:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Accept friend request
router.post('/accept/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);

    if (!friend) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.friendRequests.includes(friend._id)) {
      return res.status(400).json({ msg: 'No friend request from this user' });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friend._id.toString());
    user.friends.push(friend._id);
    friend.friends.push(user._id);

    await user.save();
    await friend.save();

    res.json({ msg: 'Friend request accepted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get friend recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const cachedRecommendations = recommendationsCache.get(req.user.id);
    if (cachedRecommendations) {
      return res.json(cachedRecommendations);
    }

    const user = await User.findById(req.user.id).populate('friends');
    const allUsers = await User.find({ _id: { $ne: req.user.id } });

    const recommendations = allUsers
      .filter(potentialFriend => 
        !user.friends.some(friend => friend._id.equals(potentialFriend._id)) &&
        !potentialFriend.friendRequests.includes(user._id) // Add this line
      )
      .map(potentialFriend => ({
        ...potentialFriend._doc,
        mutualFriends: user.friends.filter(friend => 
          potentialFriend.friends.includes(friend._id)
        ).length,
        commonInterests: user.interests.filter(interest => 
          potentialFriend.interests.includes(interest)
        ).length
      }))
      .sort((a, b) => (b.mutualFriends * 2 + b.commonInterests) - (a.mutualFriends * 2 + a.commonInterests))
      .slice(0, 5);

    recommendationsCache.set(req.user.id, recommendations);
    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Unfriend
router.post('/unfriend/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);

    if (!friend) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.friends = user.friends.filter(id => id.toString() !== friend._id.toString());
    friend.friends = friend.friends.filter(id => id.toString() !== user._id.toString());

    await user.save();
    await friend.save();

    res.json({ msg: 'Friend removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get friends
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username');
    res.json(user.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friendRequests', 'username');
    res.json(user.friendRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reject friend request
router.post('/reject/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const rejectedFriend = await User.findById(req.params.id);

    if (!rejectedFriend) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== rejectedFriend._id.toString());
    await user.save();

    res.json({ msg: 'Friend request rejected' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;