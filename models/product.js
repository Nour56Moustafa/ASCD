const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 100 },
  relatedCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' },
  manufacturerCompany: { type: String, required: true },
  price: { type: Number, required: true },
  priceOnSale: { type: Number },
  rate: { type: Number },
  numRating: { type: Number },
  type: { type: String },
  guarantee: { type: String, default: 'No guarantee presented' },
  colors: { type: [String] },
  imgUrl: { type: String },
  sizes: { type: [{ type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'] }] },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;