const fs = require("fs");
const ObjectId = require("mongodb").ObjectId;

module.exports = function(db) {
  fs.readFile("./data.json", "utf-8", (err, data) => {
    if (err) throw new Error();
    const products = JSON.parse(data).map(item => {
      item.category_id = new ObjectId(item.category_id);
      return item;
    });
    db.collection("products").insertMany(products);
  });
  //db.collection('products').deleteMany({ category_id: '5e2855a6c8d0592360407000'});
};
