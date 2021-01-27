import React from 'react';
import { StopTimesList } from '../../src/stop-time/StopTimeList';

export function StopTimeStory() {
  return <StopTimesList stopTimes={[]} agencyTimezone="Pacific/Honolulu" />;
}
