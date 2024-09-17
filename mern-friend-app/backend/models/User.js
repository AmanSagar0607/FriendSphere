const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  interests: [String] // Optional
});

UserSchema.index({ username: 1 });
UserSchema.index({ friends: 1 });
UserSchema.index({ friendRequests: 1 });

module.exports = mongoose.model('User', UserSchema);