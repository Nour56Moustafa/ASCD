const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 100 },
  content: { type: String, required: true },
  authorID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: { type: Date, default: Date.now },
  lastUpdate: { type: Date, default: Date.now },
  tags: { type: [String], default: [] },
  likesCount: { type: Number, default: 0 },
  imgUrl: { type: String },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;