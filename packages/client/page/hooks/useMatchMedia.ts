import { useState, useEffect } from 'preact/hooks';

export function useMatchMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);

    function listener() {
      setMatches(mql.matches);
    }
    listener();

    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useDarkMode() {
  const darkMode = useMatchMedia('(prefers-color-scheme: dark)');
  return darkMode;
}
