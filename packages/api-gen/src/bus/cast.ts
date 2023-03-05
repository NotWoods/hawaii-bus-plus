import { toInt } from '@hawaii-bus-plus/utils';
import { CastingContext } from 'csv-parse';

/**
 * Casting function for csv-parse, to convert string values depending on the column name.
 * @see https://csv.js.org/parse/options/cast/
 */
export function cast(value: string, context: CastingContext) {
  switch (context.column) {
    case 'stop_lat':
    case 'stop_lon':
    case 'shape_pt_lat':
    case 'shape_pt_lon':
    case 'shape_dist_traveled':
      return parseFloat(value);
    case 'route_sort_order':
    case 'stop_sequence':
    case 'transfer_duration':
    case 'min_transfer_time':
    case 'location_type':
    case 'wheelchair_boarding':
    case 'route_type':
    case 'continuous_pickup':
    case 'continuous_drop_off':
    case 'direction_id':
    case 'wheelchair_accessible':
    case 'bikes_allowed':
    case 'pickup_type':
    case 'drop_off_type':
    case 'exception_type':
    case 'payment_method':
    case 'transfers':
    case 'transfer_type':
    case 'shape_pt_sequence':
      return toInt(value);
    case 'timepoint':
    case 'monday':
    case 'tuesday':
    case 'wednesday':
    case 'thursday':
    case 'friday':
    case 'saturday':
    case 'sunday':
      return toBool(value);
    case 'start_date':
    case 'end_date':
    case 'date':
    case 'feed_start_date':
    case 'feed_end_date':
      return parseGtfsDate(value);
    case 'route_color':
    case 'route_text_color':
      return `#${value}`;
    case 'route_long_name':
      if (value === value.toUpperCase()) {
        return toTitleCase(value.replace(/\s?LINE/, ' Line:'));
      } else {
        return value;
      }
    default:
      return value;
  }
}

/**
 * Format an all-caps string to title case.
 */
function toTitleCase(text: string) {
  return text.replace(
    /(\w)(\w*)/g,
    (_, firstChar: string, rest: string) => firstChar + rest.toLowerCase(),
  );
}

/**
 * Switch from GTFS date to timestamp.
 */
function parseGtfsDate(date: string) {
  const year = date.slice(0, -4);
  const month = date.slice(-4, -2);
  const day = date.slice(-2);
  return `${year}-${month}-${day}`;
}

/**
 * Turns a number into a boolean.
 * @param i 0 returns false, 1 returns true
 */
function toBool(i: number | string): boolean {
  return toInt(i) !== 0;
}
