const fs = require("fs");
const ObjectId = require("mongodb").ObjectId;

const Products = require("../../models/product");

module.exports = function () {
  /* fs.readFile("./data.json", "utf-8", (err, data) => {
    if (err) throw new Error();
    const products = JSON.parse(data).map(item => {
      item.category_id = new ObjectId(item.category_id);
      return item;
    });
    Products.insertMany(products);
  }); */
  //Products.find({ category_id: "5e2855a6c8d0592360407000" }).deleteMany().exec();
};
