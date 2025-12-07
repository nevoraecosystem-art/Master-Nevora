export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const Result = {
  ok<T>(value: T): Result<T> {
    return { success: true, data: value };
  },
  fail<T = never>(error: string): Result<T> {
    return { success: false, error };
  },
};
