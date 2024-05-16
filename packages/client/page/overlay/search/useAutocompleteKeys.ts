import { useCallback, type Ref } from 'preact/hooks';

const options = (() => {
  if (import.meta.env.SSR) {
    return [] as readonly HTMLElement[];
  }

  return document.getElementsByClassName(
    'search__item',
  ) as HTMLCollectionOf<HTMLElement>;
})();

function isPrintableKeyCode(key: string) {
  if (key === 'Backspace') return true;

  if (key.length === 1) {
    const keyCode = key.charCodeAt(0);
    return (
      (keyCode > 47 && keyCode < 58) || // number keys
      keyCode === 32 || // spacebar
      (keyCode > 64 && keyCode < 91) || // letter keys
      (keyCode > 95 && keyCode < 112) || // numpad keys
      (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
      (keyCode > 218 && keyCode < 223) // [\]' (in order)
    );
  } else {
    return false;
  }
}

export function useAutocompleteKeys(searchBar: Ref<HTMLInputElement>) {
  return useCallback(
    (event: KeyboardEvent) => {
      const currentFocusedItem = event.target as HTMLElement;
      const index = Array.prototype.indexOf.call(options, currentFocusedItem);

      function moveFocusBy(shift: 1 | -1) {
        // This number is in the range [-2, options.length]
        const newIndex = index + shift;

        if (newIndex < 0) {
          // Focus on search bar
          searchBar.current?.focus();
        } else if (newIndex < options.length) {
          // Focus on item in list
          options[newIndex].focus();
        }
      }

      switch (event.key) {
        case 'ArrowUp':
          moveFocusBy(-1);
          break;
        case 'ArrowDown':
          moveFocusBy(1);
          break;
        case 'Escape': {
          if (index >= 0) {
            const search = searchBar.current;
            if (search) {
              search.focus();
              search.value = '';
            }
          }
          break;
        }
        default:
          if (index >= 0 && isPrintableKeyCode(event.key)) {
            searchBar.current?.focus();
          }
          break;
      }
    },
    [searchBar],
  );
}
