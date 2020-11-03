const { nanoid } = require("nanoid");

const Session = require("../models/Sessions");

class SessionService {
  async sessions(req) {
    try {
      const sessions = req.db.collection("sessions");
      if (sessions) {
        return sessions;
      }
    } catch (err) {
      console.error(err);
    }
  }
  async createSession(req, userId) {
    try {
      const sessionId = new Session(nanoid()).sessionId;
      await req.db.collection("sessions").insertOne({ sessionId, userId });
      return sessionId;
    } catch (err) {
      console.error(err);
    }
  }
  async deleteSession(req) {
    try {
      await req.db.collection("sessions").deleteOne({ userId: req.user._id });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = SessionService;
