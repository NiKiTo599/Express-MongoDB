// server.js
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();
const routes = require("./app/routes");

const db = require("./config/db");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const client = new MongoClient(db.url, db.connectOptions);

client.connect((err, client) => {
  if (err) return console.log(err);
  routes(app, client.db('test'));
  app.listen(8000, () => {
    console.log("We are live on " + 8000);
  });
});
