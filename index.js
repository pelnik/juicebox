const PORT = 3000;
const express = require("express");
const apiRouter = require("./api");
const app = express();

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log("the server is up on port", PORT);
});
