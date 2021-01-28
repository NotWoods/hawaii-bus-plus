export function getWords(...strings: string[]) {
  return (
    strings
      // split out whitespace
      .flatMap((str) => str.split(/\s/))
      // if there are dashes, add them into the list
      .flatMap((str) => [str].concat(str.includes('-') ? str.split('-') : []))
      // remove empty strings
      .filter(Boolean)
      // make all words lowercase
      .map((word) => word.toLowerCase())
  );
}
