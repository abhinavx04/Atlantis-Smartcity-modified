export class Utils {
    public static generateRandomString(length: number): string {
      return Math.random().toString(36).substring(2, length + 2);
    }
  }