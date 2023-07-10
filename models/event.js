const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 100 },
  location: { type: String, required: true, minlength: 5, maxlength: 100 },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  desc: { type: String, maxlength: 400 },
  maxAttendants: { type: Number, required: true },
  attendants: { type: Number, default: 0 },
  instructor: { type: String, required: true, maxlength: 100 },
  duration: { type: String, default: '2 hours' },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;