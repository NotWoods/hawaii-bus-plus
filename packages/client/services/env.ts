export const GOOGLE_MAPS_KEY = import.meta.env[
  'VITE_GOOGLE_MAPS_KEY'
] as string;

export const FEATURE_BILLING =
  import.meta.env['VITE_FEATURE_BILLING'] === 'true';
