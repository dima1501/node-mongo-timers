require("dotenv").config();

const express = require("express");
const router = express.Router();

const clientPromise = require("../db/db");

router.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    req.db = client.db(process.env.DB_NAME);
    next();
  } catch (error) {
    console.error(error);
  }
});

router.use("/", require("./TimerRoutes"));
router.use("/", require("./AuthRoutes"));

module.exports = router;
