const { nanoid } = require("nanoid");
const crypto = require("crypto");
const UserModel = require("../models/User");
const { ObjectId } = require("mongodb").ObjectID;

class UserService {
  async users(req) {
    try {
      const users = await req.db.collection("users").toArray();
      if (users) {
        return users;
      }
    } catch (err) {
      console.error(err);
    }
  }
  async findUserByUsername(req, username) {
    try {
      const user = await req.db.collection("users").findOne({ username });
      if (user) {
        return user;
      }
    } catch (err) {
      console.error(err);
    }
  }
  async findUserBySessionId(req, sessionId) {
    try {
      const session = await req.db.collection("sessions").findOne(
        { sessionId },
        {
          projection: { userId: 1 },
        }
      );
      if (!session) {
        return;
      }

      return req.db
        .collection("users")
        .findOne({ _id: ObjectId(session.userId) });
    } catch (err) {
      console.error(err);
    }
  }
  async createUser(req, username, password) {
    try {
      const passwordHash = await crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      const user = await new UserModel(nanoid(), username, passwordHash);
      await req.db.collection("users").insertOne(user);

      return user;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = UserService;
