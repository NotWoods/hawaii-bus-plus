/**
 * Build a click event handler that triggers a web share
 * @param text Text for web share
 * @param onError Error handler
 */
export function buildShareHandler(
  text: string,
  onError: (err: unknown) => void,
) {
  return function handleShare(evt: MouseEvent) {
    if ('share' in navigator) {
      evt.preventDefault();
      const { href } = evt.currentTarget as HTMLAnchorElement;

      navigator
        .share({
          title: 'Route on Hawaii Bus Plus',
          text,
          url: href,
        })
        .catch(onError);
    }
  };
}
