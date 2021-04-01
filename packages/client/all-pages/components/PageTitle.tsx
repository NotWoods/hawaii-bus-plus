import { useEffect } from 'preact/hooks';

export function withAppName(content?: string): string {
  const suffix = 'Hawaii Bus Plus';
  return content ? `${content} - ${suffix}` : suffix;
}

interface Props {
  children: string;
}

/**
 * Set the window title
 */
export function PageTitle({ children }: Props) {
  const title = withAppName(children);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
