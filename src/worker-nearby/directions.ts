import { IDBPDatabase } from 'idb';
import { Temporal } from 'proposal-temporal';
import { Opaque } from 'type-fest';
import { dbReady, GTFSSchema } from '../data/database';
import { TimeString } from '../shared/data-types';
import { Route, Stop, Trip } from '../shared/gtfs-types';
import { gtfsArrivalToDate } from '../shared/utils/temporal';
import { findClosestStops, StopWithDistance } from './closest-stops';

type TripCandidate = Stop['trips'][number] & { depart_index: number };
interface DirectionStepCandidate extends TripCandidate {
  arrive_index: number;
}

interface Directions {
  fromStop: StopWithDistance;
  fromRank: number;
  toStop: StopWithDistance;
  toRank: number;

  steps: {
    depart: Stop;
    depart_time: TimeString;
    arrive: Stop;
    arrive_time: TimeString;
    trip_id: Trip['trip_id'];
    route_id: Route['route_id'];
  }[];
}

export async function directionsTo(
  from: google.maps.LatLngLiteral,
  to: google.maps.LatLngLiteral,
  departTime: Temporal.PlainDateTime
) {
  const [depart, arrive] = await Promise.all([
    findClosestStops(from),
    findClosestStops(to),
  ]);

  const singleTripCandidates = new Map<
    Route['route_id'],
    DirectionStepCandidate
  >();
  const multiTripCandidates: TripCandidate[] = [];
  const departPlainTime = departTime.toPlainTime();
  for (const [i, stop] of depart.entries()) {
    for (const trip of stop.trips) {
      const { time } = gtfsArrivalToDate(trip.time);
      // If departure time is before trip time
      if (Temporal.PlainTime.compare(departPlainTime, time) < 1) {
        const tripCandidate = {
          depart_index: i,
          ...trip,
        };

        // Might be able to reach destination in single trip
        const arriveStop = arrive.findIndex((stop) =>
          stop.trips.some(
            (arriveTrip) =>
              arriveTrip.trip === trip.trip &&
              arriveTrip.sequence > trip.sequence
          )
        );
        if (arriveStop > -1) {
          if (!singleTripCandidates.has(trip.route)) {
            singleTripCandidates.set(trip.route, {
              ...tripCandidate,
              arrive_index: arriveStop,
            });
          }
        } else {
          multiTripCandidates.push(tripCandidate);
        }
      }
    }
  }

  Array.from(findNextStep(multiTripCandidates, arrive, departTime));
}

export async function directionsToStep(
  depart: StopWithDistance[],
  arrive: StopWithDistance[],
  departTime: Temporal.PlainDateTime,
  stepsLeft: number
) {
  if (stepsLeft < 0) return new Map();

  const singleTripCandidates = new Map<
    Route['route_id'],
    DirectionStepCandidate
  >();
  const multiTripCandidates: TripCandidate[] = [];
  const departPlainTime = departTime.toPlainTime();
  for (const [i, stop] of depart.entries()) {
    for (const trip of stop.trips) {
      const { time } = gtfsArrivalToDate(trip.time);
      // If departure time is before trip time
      if (Temporal.PlainTime.compare(departPlainTime, time) < 1) {
        const tripCandidate = {
          depart_index: i,
          ...trip,
        };

        // Might be able to reach destination in single trip
        const arriveStop = arrive.findIndex((stop) =>
          stop.trips.some(
            (arriveTrip) =>
              arriveTrip.trip === trip.trip &&
              arriveTrip.sequence > trip.sequence
          )
        );
        if (arriveStop > -1) {
          if (!singleTripCandidates.has(trip.route)) {
            singleTripCandidates.set(trip.route, {
              ...tripCandidate,
              arrive_index: arriveStop,
            });
          }
        } else {
          multiTripCandidates.push(tripCandidate);
        }
      }
    }
  }

  const singleEntires = Array.from(
    singleTripCandidates.values(),
    (candidate) => [candidate, new Map()]
  );
  const multiEntries = Array.from(multiTripCandidates, (candidate) => [
    candidate,
    directionsToStep(candidate.depart_index),
  ]);
}
