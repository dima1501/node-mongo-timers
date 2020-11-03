const express = require("express");
const router = express.Router();

const TimerService = require("../services/TimerService");

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

router.get("/api/timers", auth(), async (req, res) => {
  try {
    const timers = await new TimerService().timers(req);
    res.status(200).send(timers);
  } catch (err) {
    console.error(err);
  }
});

router.post("/api/timers/:id/stop", auth(), async (req, res) => {
  try {
    const timer = await new TimerService().stopTimer(req);
    if (timer) {
      res.status(200).json({ timer });
    } else {
      res.status(404).send("Timer not found");
    }
  } catch (err) {
    console.error(err);
  }
});

router.post("/api/timers", auth(), async (req, res) => {
  const description = req.body.description;

  if (description) {
    try {
      const newTimer = await new TimerService().createTimer(req, description);
      res.status(201).json(newTimer);
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(404).send("No description");
  }
});

module.exports = router;
