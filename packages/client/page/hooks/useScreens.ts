// @ts-expect-error test
import resolveConfig from 'tailwindcss/resolveConfig';
import { useMatchMedia } from './useMatchMedia';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Config {
  theme: {
    screens: Record<Breakpoint, 'string'>;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const config = resolveConfig({}) as Config;

export function useScreens(breakpoint: Breakpoint) {
  return useMatchMedia(`(min-width: ${config.theme.screens[breakpoint]})`);
}
