const express = require("express");
const apiRouter = express.Router();
const usersRouter = require("./users");
const postRouter = require('./posts');

apiRouter.use("/users", usersRouter);
apiRouter.use('/posts', postRouter);


module.exports = apiRouter;
