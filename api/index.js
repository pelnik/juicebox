const express = require("express");
const apiRouter = express.Router();
const usersRouter = require("./users");
const postRouter = require("./posts");
const tagsRouter = require("./tags");

apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postRouter);
apiRouter.use("/tags", tagsRouter);

module.exports = apiRouter;
