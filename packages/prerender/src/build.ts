import { prerenderPage } from './prerender-page.js';
import { prerenderShare } from './prerender-share.js';

async function main() {
  await prerenderShare(true);
  await prerenderPage(true);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
