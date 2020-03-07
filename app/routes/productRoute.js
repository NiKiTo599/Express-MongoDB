const ObjectId = require("mongodb").ObjectId;
const queryString = require("query-string");

module.exports = function(app, database) {
  app.get("/search", (req, res) => {
    let objOfUrl = queryString.parse(req.url);
    let query = objOfUrl["/search?query"];
    /*database
      .collection("products")
      .createIndex({ name: "text" }, { default_language: "russian" });*/
    const details = { $text: { $search: '"' + query + '"' } };
    database
      .collection("products")
      .find(details)
      .project({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .toArray((err, item) => {
        if (err) {
          res.send({ error: err });
        } else if (item.length === 0) {
          database
            .collection("products")
            .find({ $text: { $search: query } })
            .project({ score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .limit(10)
            .toArray((err, item) => {
              if (err) {
                res.send({ error: err });
              } else if (item.length === 0) {
                database
                  .collection("products")
                  .find({ name: { $regex: new RegExp(query, "i") } })
                  .limit(10)
                  .toArray((err, item) => {
                    if (err) {
                      res.send({ error: "An error has occurred" });
                    } else {
                      res.send(item);
                    }
                  });
              } else {
                res.send(item);
              }
            });
        } else {
          res.send(item);
        }
      });
  });

  app.get("/home", (req, res) => {
    const objOfUrl = queryString.parse(req.url);
    const details = { category_id: new ObjectId(objOfUrl["/home?query"]) };
    database
      .collection("products")
      .find(details, { score: { $meta: "textScore" } })
      .limit(10)
      .skip((objOfUrl.page - 1) * 10)
      .toArray((err, item) => {
        if (err) {
          res.send({ error: "An error has occurred" });
        } else {
          res.send(item);
        }
      });
  });

  app.post("/home", (req, res) => {
    let body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      console.log("Body: " + JSON.parse(body));
      let result = JSON.parse(body)
      console.log(result['Диагональ'])
    });
    /*database
      .collection("products")
      .find(details, { score: { $meta: "textScore" } })
      .limit(10)
      .skip((objOfUrl.page - 1) * 10)
      .toArray((err, item) => {
        if (err) {
          res.send({ error: "An error has occurred" });
        } else {
          res.send(item);
        }
      });*/
  });

  app.get("/count", (req, res) => {
    const objOfUrl = queryString.parse(req.url);
    const details = { category_id: new ObjectId(objOfUrl["/count?query"]) };
    database
      .collection("products")
      .find(details)
      .count()
      .then(item => {
        res.send(JSON.stringify(item));
      });
  });
  app.get("/product", (req, res) => {
    const objOfUrl = queryString.parse(req.url);
    const details = { _id: new ObjectId(objOfUrl["/product?id"]) };
    database.collection("products").findOne(details, (err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(item);
      }
    });
  });
  app.get("/productattributes", (req, res) => {
    const objOfUrl = queryString.parse(req.url);
    const details = {
      category_id: new ObjectId(objOfUrl["/productattributes?query"])
    };
    database
      .collection("products")
      .find(details, { attributes: 1 })
      .toArray((err, item) => {
        if (err) {
          res.send({ error: "An error has occurred" });
        } else {
          res.send(item);
        }
      });
  });
};
