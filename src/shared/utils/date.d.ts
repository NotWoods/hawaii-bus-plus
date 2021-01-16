/**
 * Returns a special `Date` without an associated year or month.
 *
 * Used throughout the application to represent times with no dates attached.
 * This roughly equates to `Temporal.PlainTime` with space for overflow.
 */
export declare function plainTime(hours: number, minutes: number, seconds: number): Date;
/**
 * Turns a date into a string with hours, minutes.
 * @param  {Date} 	date Date to convert
 * @param  {string} date 24hr string in format 12:00:00 to convert to string in 12hr format
 * @return {string}    	String representation of time
 */
export declare function stringTime(date: Date | string): string;
/**
 * Returns a date object based on the string given
 * @param  {string} string in format 13:00:00, from gtfs data
 * @return {Date}
 */
export declare function gtfsArrivalToDate(string: string): Date;
/**
 * Combines stringTime() and gtfsArrivalToDate()
 * @param  {string} string in format 13:00:00, from gtfs data
 * @return {string}        String representation of time
 */
export declare function gtfsArrivalToString(string: string): string;
/**
 * Returns the current time, with date stripped out
 * @return {Date} Current time in hour, min, seconds; other params set to 0
 */
export declare function nowPlainTime(): Date;
