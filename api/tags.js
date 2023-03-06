const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log('req is being made to /tags');

  next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const posts = await getPostsByTagName(tagName);

    res.send({
      posts: posts,
    });

  } catch (error) {
    next({
      name: "NotValidTag",
      message: "The tag entered is not valid."
    });
  }
});

tagsRouter.get('/', async (req, res, next) => {
  try {
    const tags = await getAllTags();
    res.send({
      tags,
    });
  } catch (error) {
    console.log(error, 'error in tags');
  }
});

module.exports = tagsRouter;
