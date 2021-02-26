import { prerenderAuth } from './prerender-auth.js';

prerenderAuth(true).catch((err) => console.error(err));
