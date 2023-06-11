type LogPararms = Parameters<typeof console.log>;

export default class DevLog {
  static log(...args: LogPararms) {
    console.log(...args);
  }

  static getLabeledLogger(label: string) {
    return (...args: LogPararms) => this.log(label, ...args);
  }
}
