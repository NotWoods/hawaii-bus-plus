import { readFile } from 'fs/promises';
import { resolve } from 'path';

export { theme } from './theme.js';

export function headHtml() {
  const filePath = resolve(__dirname, '../head.html');
  return readFile(filePath, 'utf8');
}
