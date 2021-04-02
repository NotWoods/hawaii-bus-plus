import { prerenderAuth } from './prerender-auth.js';
import { prerenderPage } from './prerender-page.js';
import { prerenderShare } from './prerender-share.js';

async function main() {
  await prerenderAuth(true);
  await prerenderShare(true);
  await prerenderPage(true);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
