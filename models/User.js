const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 20 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 20 },
  phoneNumber: { type: String, validate: /^\d{10}$/ },
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  username: { type: String, required: true, maxlength: 40 },
  role: { type: [{ type: String, enum: ['admin', 'user'] }], required: true, default: 'user' },
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

const User = mongoose.model('User', userSchema);

module.exports = User;