module.exports = function(app, database) {
  app.get("/productCategories", (req, res) => {
    database.collection("productCategories").find().toArray((err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(item);
      }
    });
  });
};
