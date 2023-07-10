const mongoose = require('mongoose');

const productCartSchema = new mongoose.Schema({
  productID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  quantity: { type: Number, default: 1, min: 1 },
});

const ProductCart = mongoose.model('ProductCart', productCartSchema);

module.exports = ProductCart;