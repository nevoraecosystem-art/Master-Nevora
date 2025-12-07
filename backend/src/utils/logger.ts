export class Logger {
  static info(message: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, meta ?? '');
  }

  static error(message: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta ?? '');
  }

  static warn(message: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, meta ?? '');
  }
}
