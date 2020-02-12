module.exports = function(app, database) {
  app.get("/customers/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    database.collection("customers").findOne(details, (err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(item);
      }
    });
  });

  app.delete("/customers/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    database.collection("customers").remove(details, (err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send("Note " + id + " deleted!");
      }
    });
  });

  app.put("/customers/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    database.collection("customers").update(details, note, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(note);
      }
    });
  });
  app.post("/customers", (req, res) => {
    const customer = {
      date_created: new Date(),
      total_spent: req.body.spent,
      orders_count: req.body.count,
      note: req.body.note,
      email: req.body.email,
      mobile: req.body.mobile,
      firstName: req.body.name,
      lastName: req.body.lastName
    };
    database.collection('customers').insert(customer, (err, result) => {
      if (err) {
        res.send({'error': 'An error has occurred'})
      } else {
        res.send(result.ops[0])
      }
    })
  });
  
};
