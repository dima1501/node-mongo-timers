const UserService = require("../services/UserService");

const auth = () => async (req, res, next) => {
  if (!req.cookies["sessionId"]) {
    return next();
  }

  try {
    const user = await new UserService().findUserBySessionId(
      req,
      req.cookies["sessionId"]
    );
    req.user = user;
    req.sessionId = req.cookies["sessionId"];
    next();
  } catch (err) {
    console.error(err);
  }
};

module.exports = auth;
