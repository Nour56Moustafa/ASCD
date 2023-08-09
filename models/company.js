const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const companySchema = new mongoose.Schema({
  email: { type: String, required: [true, 'Please provide email'], unique: true, match: [
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'Please provide a valid email',
  ] },
  password: { type: String, required: [true, 'Please provide password'], minlength: 8 },
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  approved: {type: Boolean, default: false},
  origin: { type: String, required: true },
  branches: { type: [String], required: [true, 'please provide at least one branch name'], minlength: 1 },
  accounts: { type: [String], required: [true, 'please provide at least one account name'], minlength: 1 },
  desc: { type: String, maxlength: 100 },
  profileImgUrl: { type: String },
  companyImgUrl: { type: String },
});

companySchema.pre('save', async function (next) {
  const company = this;
  if (!company.isModified('password')) return next();
  const salt = await bcrypt.genSalt();
  company.password = await bcrypt.hash(company.password, salt);
  next();
});

companySchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

companySchema.methods.createJWT = function () {
  return jwt.sign( {name: this.name, id: this.id},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}


const Company = mongoose.model('Company', companySchema);

module.exports = Company;