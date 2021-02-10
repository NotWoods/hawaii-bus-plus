import { useEffect, useState } from 'preact/hooks';
// @ts-expect-error test
import resolveConfig from 'tailwindcss/resolveConfig';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Config {
  theme: {
    screens: Record<Breakpoint, 'string'>;
  };
}

const config = resolveConfig({}) as Config;

export function useScreens(breakpoint: Breakpoint) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${config.theme.screens[breakpoint]})`
    );
    setMatches(mql.matches);

    function listener() {
      setMatches(mql.matches);
    }

    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
}
