// server.js
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();
const routes = require("./app/routes");
const insertManyProducts = require('./app/routes/insertManyProducts')

const db = require("./config/db");
const parser = require('./app/parser/parser')

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//parser();
const client = new MongoClient(db.url, db.connectOptions);

client.connect((err, client) => {
  if (err) return console.log(err);
  routes(app, client.db('test'));
  //insertManyProducts(client.db('test'))
  app.listen(8000, () => {
    console.log("We are live on " + 8000);
  });
});
