const Timer = require("../models/Timer");
const { nanoid } = require("nanoid");

class TimerService {
  async timers(req) {
    try {
      const timers = await req.db.collection("timers").find({}).toArray();
      const data = await Object.values(timers).filter((timer) => {
        if (req.query.isActive === "true") {
          return timer.isActive;
        } else if (req.query.isActive === "false") {
          return !timer.isActive;
        }
        return timer;
      });

      if (data) {
        data.map((t) => {
          t.progress = new Timer(t).getProgress;
        });
        return data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async createTimer(req, description) {
    try {
      const timerData = {
        start: Date.now(),
        end: null,
        description: description,
        progress: 0,
        isActive: true,
        id: nanoid(),
        duration: 0,
      };
      const timer = await new Timer(timerData);

      await req.db.collection("timers").insertOne(timer);
      return timer;
    } catch (err) {
      console.error(err);
    }
  }

  async stopTimer(req) {
    try {
      const timers = await new TimerService().timers(req);
      const timer = Object.values(timers).find((t) => t.id === req.params.id);

      if (timer) {
        await req.db
          .collection("timers")
          .updateOne(
            { id: req.params.id },
            { $set: new Timer(timer).stop(timer) }
          );
        return { timer };
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
    }

    return timer;
  }
}

module.exports = TimerService;
