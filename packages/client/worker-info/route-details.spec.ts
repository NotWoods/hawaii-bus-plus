import { extractLinks } from './route-details';

test('extractLinks separates link', async () => {
  const routeDesc =
    'For more information go to the Park website at; https: //www.nps.gov/havo/planyourvisit/fees.htm';
  const links = extractLinks(routeDesc);

  expect(links[0].type).toBe('text');
  expect(links[1].type).toBe('link');

  expect(links[1].value).toBe(
    'https://www.nps.gov/havo/planyourvisit/fees.htm'
  );
});
