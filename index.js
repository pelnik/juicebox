require('dotenv').config();

const {PORT = 3000} = process.env;
const express = require("express");
const apiRouter = require("./api");
const app = express();
const morgan = require('morgan');
const { client } = require('./db');


app.use(morgan('dev'));
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use("/api", apiRouter);

client.connect();

app.listen(PORT, () => {
  console.log("the server is up on port", PORT);
});
