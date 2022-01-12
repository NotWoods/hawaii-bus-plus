import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

export function headHtml() {
  const filePath = resolve(__dirname, '../head.html');
  return readFileAsync(filePath, 'utf8');
}
