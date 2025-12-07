export class Logger {
  private static shouldDebug(): boolean {
    return ["1", "true", "yes", "on"].includes(
      (process.env.DEBUG || "").toLowerCase()
    );
  }

  static info(message: string, ...meta: unknown[]): void {
    console.log(`[INFO] ${message}`, ...meta);
  }

  static warn(message: string, ...meta: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...meta);
  }

  static error(message: string, ...meta: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...meta);
  }

  static debug(message: string, ...meta: unknown[]): void {
    if (!Logger.shouldDebug()) return;
    console.debug(`[DEBUG] ${message}`, ...meta);
  }
}
