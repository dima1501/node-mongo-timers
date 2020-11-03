module.exports = {
  async up(db) {
    await db.createCollection("timers");
  },

  async down(db) {
    await db.dropCollection("timers");
  },
};
