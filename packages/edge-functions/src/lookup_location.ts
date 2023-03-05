import type { Context } from 'https://edge.netlify.com/';

export default async function handler(_request: Request, context: Context) {
  const { latitude, longitude } = context.geo;
  const coordinates = { latitude, longitude };

  return Response.json(coordinates);
}
