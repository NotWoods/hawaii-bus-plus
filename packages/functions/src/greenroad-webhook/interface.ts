export interface GreenRoadMetadata {
  /** Organizational Unit Id */
  CustomerId: number;
  /** Message receive time, timestamp */
  RecieveTime: string;
  /** Message occurrence time (UTC), timestamp */
  Time: string;
  /** Tracking Vehicle data */
  VehicleData: GreenRoadVehicleData;
}

/** Supported device source types */
export const GreenRoadDeviceSource = {
  GreenRoadUnit: 1,
  Mobile: 2,
  SmartOBDII: 3,
} as const;
export type GreenRoadDeviceSource =
  (typeof GreenRoadDeviceSource)[keyof typeof GreenRoadDeviceSource];

export interface GreenRoadVehicleData {
  DriverData: {
    ExternalId: string;
    Id: number;
    PersonalId: string;
  };
  ExternalId: string;
  GreenRoadDeviceId: number;
  DeviceSource: GreenRoadDeviceSource;
  Id: number;
  Label: string;
  /** Root Organization Unit Id */
  RootId: number;
  RegistrationPlate: string;
  /** Vehicle identification number. Can be used as primary key. */
  VIN: string;
}

export interface GreenRoadLocation {
  /** Location heading (0 – 359) */
  Heading: number;
  /** Location latitude (decimal) */
  Latitude: number;
  /** Location longitude (decimal) */
  Longitude: number;
  /** Kilometers per hour */
  SpeedKMH: number;
  /** Miles per hour */
  SpeedMPH: number;
}

export interface GreenRoadMessage {
  Metadata: GreenRoadMetadata;
  Location?: GreenRoadLocation;
  Event?: unknown;
  VehicleDiagnostics?: unknown;
}
