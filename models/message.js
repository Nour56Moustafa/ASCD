const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: [true, 'Can not send an empty message'] },
  date: { type: Date, default: Date.now },
  time: { type: String, default: (new Date()).toLocaleTimeString() },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;