require("dotenv").config();

const { MongoClient } = require("mongodb");

const clientPromise = new MongoClient.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

module.exports = clientPromise;
