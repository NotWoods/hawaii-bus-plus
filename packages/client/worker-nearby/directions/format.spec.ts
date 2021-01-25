import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { Stop, StopTime, TimeString, Trip } from '@hawaii-bus-plus/types';
import { PlainDaysTime } from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';
import { journeyToDirections, JourneyTripSegment } from './format';
import { CompletePath } from './raptor';

const NOON = PlainDaysTime.from('12:00:00' as TimeString);
const MONDAY = Temporal.PlainDate.from({ year: 2021, month: 1, day: 25 });

const LAKELAND = 'll' as Stop['stop_id'];
const HWY_INTERSECTON = 'hw' as Stop['stop_id'];
const PARKER_RANCH = 'pr' as Stop['stop_id'];

test('journeyToDirections no walking', async () => {
  const repo = new NodeRepository();

  const path: CompletePath = [
    { time: NOON },
    {
      time: NOON.add({ minutes: 45 }),
      transferFrom: LAKELAND,
      trip: 'waimea-waimea-pm-0-0' as Trip['trip_id'],
      stopTime: {
        arrival_time: '12:45:00',
        departure_time: '12:45:00',
        stop_id: PARKER_RANCH,
        stop_sequence: 5,
      } as StopTime,
    },
    {
      time: NOON.add({ hours: 3, minutes: 45 }),
      transferFrom: PARKER_RANCH,
      trip: 'kohala-kona-0645am-nkohala-waim-kona-1' as Trip['trip_id'],
      stopTime: {
        arrival_time: '15:45:00',
        departure_time: '15:45:00',
        stop_id: HWY_INTERSECTON,
        stop_sequence: 12,
        timepoint: true,
      } as StopTime,
    },
  ];

  const stops = await repo.loadStops([LAKELAND, PARKER_RANCH, HWY_INTERSECTON]);
  const lakeland = stops.get(LAKELAND)!;
  const hwyIntersection = stops.get(HWY_INTERSECTON)!;
  const parkerRanch = stops.get(PARKER_RANCH)!;

  const journey = await journeyToDirections(
    repo,
    {
      type: 'stop',
      stop_id: LAKELAND,
      name: lakeland.stop_name,
      position: lakeland.position,
    },
    {
      type: 'stop',
      stop_id: HWY_INTERSECTON,
      name: hwyIntersection.stop_name,
      position: hwyIntersection.position,
    },
    MONDAY.toPlainDateTime(NOON),
    path
  );

  expect(journey).toEqual({
    depart: undefined,
    arrive: undefined,
    trips: expect.any(Array),
  });
  expect(journey.trips).toHaveLength(2);
  expect(journey.trips[0]).toEqual({
    route: expect.objectContaining({ route_id: 'waimea' }),
    trip: expect.objectContaining({ trip_id: 'waimea-waimea-pm-0-0' }),
    stopTimes: expect.any(Array),
  });
  expect(journey.trips[1]).toEqual({
    route: expect.objectContaining({ route_id: 'kohala-kona' }),
    trip: expect.objectContaining({
      trip_id: 'kohala-kona-0645am-nkohala-waim-kona-1',
    }),
    stopTimes: expect.any(Array),
  });

  const [waimea, kohalaKona] = journey.trips as JourneyTripSegment[];
  expect(waimea.stopTimes).toEqual([
    {
      arrivalTime: expect.objectContaining({ string: '12:30:00' }),
      departureTime: expect.objectContaining({ string: '12:30:00' }),
      stop: lakeland,
      timepoint: true,
    },
    expect.objectContaining({
      stop: expect.objectContaining({ stop_id: 'hh-kamamalu' }),
    }),
    expect.objectContaining({
      stop: expect.objectContaining({ stop_id: 'hh-hiiaka' }),
    }),
    expect.objectContaining({
      stop: expect.objectContaining({ stop_id: 'hh-hale' }),
    }),
    expect.objectContaining({
      stop: expect.objectContaining({ stop_id: 'hh-kuhio' }),
    }),
    {
      arrivalTime: expect.objectContaining({ string: '12:45:00' }),
      departureTime: expect.objectContaining({ string: '12:45:00' }),
      stop: parkerRanch,
      timepoint: true,
    },
  ]);
  expect(kohalaKona.stopTimes).toEqual([
    {
      arrivalTime: expect.objectContaining({ string: '15:25:00' }),
      departureTime: expect.objectContaining({ string: '15:25:00' }),
      stop: parkerRanch,
      timepoint: true,
    },
    expect.objectContaining({
      stop: expect.objectContaining({ stop_id: 'wp' }),
    }),
    {
      arrivalTime: expect.objectContaining({ string: '15:45:00' }),
      departureTime: expect.objectContaining({ string: '15:45:00' }),
      stop: hwyIntersection,
      timepoint: true,
    },
  ]);
});
