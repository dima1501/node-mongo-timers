const Timer = class Timer {
  constructor(timer) {
    this.start = timer.start;
    this.end = timer.end;
    this.description = timer.description;
    this.progress = timer.progress;
    this.isActive = timer.isActive;
    this.id = timer.id;
    this.duration = timer.duration;
  }

  get getProgress() {
    return Date.now() - +this.start;
  }

  stop(timer) {
    const stoppedTimer = {
      isActive: false,
      end: Date.now(),
      duration: Date.now() - timer.start,
    };
    return stoppedTimer;
  }
};

module.exports = Timer;
