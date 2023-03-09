const express = require('express');
const postRouter = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require('../db');
const { requireUser, requireActiveUser } = require('./utils');

postRouter.use((req, res, next) => {
  console.log('A request is being made to /posts');

  next();
});

postRouter.post('/', requireUser, requireActiveUser, async (req, res, next) => {
  const { title, content, tags = '' } = req.body;
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
      post.isAuthor = false;

      if (req.user && req.user.id === post.author.id) {
        post.isAuthor = true;
      }

      res.send({ post });
    } else {
      next(error);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postRouter.get('/', async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();

    console.log(allPosts);
    const posts = allPosts.filter((post) => {
      post.isAuthor = false;

      if (req.user && req.user.id === post.author.id) {
        post.isAuthor = true;
      }

      if (post.active === true && post.author.active === true) {
        return true;
      }

      if (req.user && post.author.id === req.user.id) {
        return true;
      }
      return false;
    });

    res.send({
      posts,
    });
  } catch (error) {
    console.error('Error on get all posts', error);
  }
});

postRouter.patch(
  '/:postId',
  requireUser,
  requireActiveUser,
  async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;

    const updateFields = {};

    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }

    if (title) {
      updateFields.title = title;
    }

    if (content) {
      updateFields.content = content;
    }

    try {
      const originalPost = await getPostById(postId);

      if (originalPost.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);

        updatedPost.isAuthor = false;

        if (req.user && req.user.id === updatedPost.author.id) {
          updatedPost.isAuthor = true;
        }

        res.send({ post: updatedPost });
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours',
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

postRouter.delete(
  '/:postId',
  requireUser,
  requireActiveUser,
  async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);

      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });

        res.send({ post: updatedPost });
      } else {
        next(
          post
            ? {
                name: 'UnauthorizedUserError',
                message: 'You cannot delete a post which is not yours',
              }
            : {
                name: 'PostNotFoundError',
                message: 'That post does not exist',
              }
        );
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = postRouter;
