const PORT = 3000;
const express = require("express");
const apiRouter = require("./api");
const app = express();
const morgan = require('morgan');
const { client } = require('./db');

app.use(morgan('dev'));
app.use(express.json());
app.use("/api", apiRouter);

client.connect();

app.listen(PORT, () => {
  console.log("the server is up on port", PORT);
});
