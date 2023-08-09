const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'Please provide first name'], minlength: 3, maxlength: 20 },
  lastName: { type: String, required: [true, 'Please provide last name'], minlength: 3, maxlength: 20 },
  phoneNumber: { type: String, validate: /^\d{10}$/ },
  email: { type: String, required: [true, 'Please provide email'], unique: true, match: [
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'Please provide a valid email',
  ] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  password: { type: String, required: [true, 'Please provide password'], minlength: 8 },
  username: { type: String, required: [true, 'Please provide username'], maxlength: 40 },
  role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },
  region: { type: String, maxlength: 30 },
  title: { type: String, maxlength: 20 },
  favBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  favProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createJWT = function () {
  return jwt.sign( {username: this.username, id: this.id} ,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

const User = mongoose.model('User', userSchema);

module.exports = User;