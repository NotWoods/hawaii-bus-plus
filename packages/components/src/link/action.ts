export function linkAction(href: string | URL) {
  const url = typeof href === 'string' ? new URL(href) : href;
  return { type: 'link', url } as const;
}