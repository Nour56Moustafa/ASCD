const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  approved: {type: Boolean, default: false},
  origin: { type: String, required: true },
  branches: { type: [String], required: [true, 'please provide at least one branch name'], minlength: 1 },
  accounts: { type: [String], required: [true, 'please provide at least one account name'], minlength: 1 },
  desc: { type: String, maxlength: 100 },
  profileImgUrl: { type: String },
  companyImgUrl: { type: String },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;