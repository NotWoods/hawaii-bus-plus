import { useMatchMedia } from './useMatchMedia';

// Breakpoints from Tailwind.
// TODO find a way to render these values from config
// without pulling in entire tailwind library
const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

type Breakpoint = keyof typeof screens;

export function useScreens(breakpoint: Breakpoint) {
  return useMatchMedia(`(min-width: ${screens[breakpoint]})`);
}
