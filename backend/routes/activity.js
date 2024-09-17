const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get recent activity
router.get('/', auth, async (req, res) => {
  try {
    // For now, we'll just return a mock activity list
    // In a real application, you'd fetch this from a database
    const activities = [
      { id: 1, description: 'User1 added User2 as a friend', timestamp: new Date() },
      { id: 2, description: 'User3 updated their profile', timestamp: new Date() },
      { id: 3, description: 'User4 joined FriendSphere', timestamp: new Date() },
    ];
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;