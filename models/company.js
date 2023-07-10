const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  origin: { type: String, required: true },
  branches: { type: [String], required: true, minlength: 1 },
  accounts: { type: [String], required: true, minlength: 1 },
  desc: { type: String, maxlength: 100 },
  profileImgUrl: { type: String },
  companyImgUrl: { type: String },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;