module.exports = function(app, database) {
  app.post("/customers", (req, res) => {
    const customer = {
      date_created: Date.now(),
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
