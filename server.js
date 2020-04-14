// server.js
const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");
const app = express();
const cors = require("cors");

const routes = require("./app/routes");
const insertManyProducts = require("./app/routes/insertManyProducts");

const db = require("./config/db");
const parser = require("./app/parser/parser");

//parser();

mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

const dbConnection = mongoose.connection;
dbConnection.on("error", err => {
  console.log(`Connection error: ${err}`);
});
dbConnection.once("open", () => {
  console.log("Connected to DB!");
  insertManyProducts();
});

app.listen(8000, err => {
  err ? console.log(err) : console.log("Server started!");
});
