const ObjectId = require('mongodb').ObjectId; 
const queryString = require('query-string');

module.exports = function(app, database) {
  app.get("/home", (req, res) => {
    const objOfUrl = queryString.parse(req.url);
    const details = { category_id: new ObjectId(objOfUrl['/home?query']) };
    database.collection("products").find(details).toArray((err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(item);
      }
    });
  });

  app.get("/image", (req, res) => {
    const id = req.params.id;
    const objOfUrl = queryString.parse(req.url);
    console.log(objOfUrl['/home?query'])
    const details = { category_id: new ObjectId(objOfUrl['/home?query']) };
    database.collection("products").find(details).toArray((err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(item);
      }
    });
  });

  app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectId(id) };
    database.collection("products").remove(details, (err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send("Note " + id + " deleted!");
      }
    });
  });

  app.put("/products/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectId(id) };
    const note = { text: req.body.body, title: req.body.title };
    database.collection("products").update(details, note, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(note);
      }
    });
  });

  app.post("/products", (req, res) => {
    const product = {
      date_created: new Date(),
      images: req.body.images,
      dimensions: req.body.dimensions,
      note: req.body.note,
      description: req.body.description,
      meta_description: req.body.meta_description,
      meta_title: req.body.meta_title,
      name: req.body.lastName,
      attributes: req.body.attributes,
      discontinued: req.body.discontinued,
      price: req.body.price,
      category_id: req.body.category_id
    };
    database.collection("products").insert(product, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};
