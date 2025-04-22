import { toZonedTime, format } from "date-fns-tz";
import { startOfDay, addHours } from "date-fns";

export class DayFunctions {
  static getTodayDateRangeInPacificTime(): [Date, Date] {
    const timeZone = "America/Los_Angeles";

    // Get the current date and convert to Pacific Time
    const now = new Date();
    const pacificNow = toZonedTime(now, timeZone);

    // Get start and end of the day in Pacific Time
    const pacificStartOfDay = startOfDay(pacificNow);
    
    // const pacificEndOfDay = addDays(pacificStartOfDay, 1);
    const pacificEndOfDay = addHours(pacificStartOfDay, 24);

    // Convert Pacific Time back to UTC for Firestore queries
    const startOfDayUTC = new Date(
      format(pacificStartOfDay, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: "UTC" })
    );
    const endOfDayUTC = new Date(
      format(pacificEndOfDay, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: "UTC" })
    );

    return [startOfDayUTC, endOfDayUTC];
  }

  static getYesterdayDateRangeInPacificTime(): [Date, Date] {
    const timeZone = "America/Los_Angeles";

    // Get the current date and convert to Pacific Time
    const now = new Date();
    const pacificNow = toZonedTime(now, timeZone);

    // Get start and end of the day in Pacific Time
    const pacificStartOfDay = addHours(startOfDay(pacificNow), -24);
    
    // const pacificEndOfDay = addDays(pacificStartOfDay, 1);
    const pacificEndOfDay = addHours(pacificStartOfDay, 24);

    // Convert Pacific Time back to UTC for Firestore queries
    const startOfDayUTC = new Date(
      format(pacificStartOfDay, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: "UTC" })
    );
    const endOfDayUTC = new Date(
      format(pacificEndOfDay, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: "UTC" })
    );

    return [startOfDayUTC, endOfDayUTC];
  }
}

