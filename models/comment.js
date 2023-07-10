const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: [true, 'Can not post an empty comment'] },
  date: { type: Date, default: Date.now },
  time: { type: String, default: (new Date()).toLocaleTimeString() },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  blogID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Blog' },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;