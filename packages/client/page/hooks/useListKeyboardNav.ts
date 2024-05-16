import { useCallback, type Inputs } from 'preact/hooks';

/**
 * Helps handle keyboard navigation for a list of links.
 * Excepts to be attached to a <ul>, and to have focusable elements as direct children of <li>.
 */
export function useListKeyboardNav(
  findElement: (
    evt: KeyboardEvent,
    listItem: HTMLLIElement,
  ) => Element | null | undefined,
  inputs: Inputs,
) {
  return useCallback(
    (evt: KeyboardEvent) => {
      const listItem = (evt.target as Node).parentElement as HTMLLIElement;

      const moveFocusTo = findElement(evt, listItem);
      const link = moveFocusTo?.firstChild;
      if (link instanceof HTMLElement) {
        link.focus();
        evt.preventDefault();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...inputs],
  );
}
