const express = require("express");
const postRouter = express.Router();
const { getAllPosts, createPost } = require("../db");
const { requireUser } = require("./utils");

postRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  if (tagArr.length) {
    postData.tags = tagArr;
  }
  try {
    postData.title = title;
    postData.content = content;
    postData.authorId = req.user.id;

    const post = await createPost(postData);
    if (post) {
      restart.send({ post });
    } else {
      next(error);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }

  res.send({ message: "under construction" });
});

postRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.send({
      posts,
    });
  } catch (error) {
    console.error("Error on get all posts", error);
  }
});

module.exports = postRouter;
