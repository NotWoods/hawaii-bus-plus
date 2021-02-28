import { prerenderAuth } from './prerender-auth.js';
import { prerenderPage } from './prerender-page.js';

async function main() {
  await prerenderAuth(true);
  await prerenderPage(true);
}

main().catch((err) => console.error(err));
