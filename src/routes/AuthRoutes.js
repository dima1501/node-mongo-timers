const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const UserService = require("../services/UserService");
const SessionService = require("../services/SessionService");

const auth = require("../middlewares/AuthMiddleware");

router.get("/", auth(), (req, res) => {
  res.render("index", {
    user: req.user,
    authError:
      req.query.authError === "true"
        ? "Wrong username or password"
        : req.query.authError,
  });
});

router.post(
  "/login",
  auth(),
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await new UserService().findUserByUsername(req, username);
      const passwordHash = await crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      if (!user || passwordHash !== user.password) {
        return res.redirect("/?authError=true");
      }

      const sessionId = await new SessionService().createSession(req, user._id);
      res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
    } catch (err) {
      console.error(err);
    }
  }
);

router.post(
  "/signup",
  auth(),
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await new UserService().createUser(req, username, password);
      const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      if (!user || passwordHash !== user.password) {
        return res.redirect("/?authError=true");
      }

      const sessionId = await new SessionService().createSession(req, user._id);
      res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
    } catch (err) {
      console.error(err);
    }
  }
);

router.get("/logout", auth(), async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }

  try {
    await new SessionService().deleteSession(req, req.sessionId);
    res.clearCookie("sessionId").redirect("/");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
