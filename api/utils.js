const { getUserById } = require("../db");

function requireUser(req, res, next) {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }

  next();
}

async function requireActiveUser(req, res, next) {
  try {
    const user = await getUserById(req.user.id);

    if (!user.active) {
      next({
        name: "NonactiveUserError",
        message: "User must be active to perform this action",
      });
    }

    next();
  } catch ({message, name}) {
    next({
      message,
      name
    });
  }

  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }

  next();
}

module.exports = {
  requireUser,
  requireActiveUser,
};
