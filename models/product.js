  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  regular_price: Number,
  category_id: mongoose.Schema.Types.ObjectId,
  meta_description: String,
  stock: String,
  meta_title: String,
  description: Array,
  attributes: Array,
  images: Array
});

module.exports = mongoose.model('Products', productSchema);