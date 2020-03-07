const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
  _id: String,
  name: String,
  parent_id: String,
  meta_description: String,
});

module.exports = mongoose.model('categories', categoriesSchema);