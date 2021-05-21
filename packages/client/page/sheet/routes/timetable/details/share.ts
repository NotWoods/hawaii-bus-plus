export function buildShareHandler(
  text: string,
  onError: (err: unknown) => void,
) {
  return function handleShare(evt: MouseEvent) {
    evt.preventDefault();
    const { href } = evt.currentTarget as HTMLAnchorElement;

    navigator
      .share({
        title: 'Route on Hawaii Bus Plus',
        text,
        url: href,
      })
      .catch(onError);
  };
}
