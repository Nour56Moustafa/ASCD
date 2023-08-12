const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  desc: { type: String }
});

const Statistics = mongoose.model('Statistics', statisticsSchema);

module.exports = Statistics;
