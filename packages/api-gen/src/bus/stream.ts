import { Transform } from 'stream';

const ZERO_WIDTH_SPACE = '\ufeff';

/**
 * Removes the zero-width space character from the stream.
 * This can show up in some CSV files, like those provided by Hele-On Bus.
 */
export function removeHiddenCharacters() {
  return new Transform({
    transform(chunk: Buffer, _, callback) {
      const data = chunk.toString();
      const modified = data.replaceAll(ZERO_WIDTH_SPACE, '');
      callback(null, modified);
    },
  });
}
