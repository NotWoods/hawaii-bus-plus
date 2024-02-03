import { describe, test } from 'vitest';
import { FixtureName, NodeFixtureRepository } from '../src/fixture.js';

describe.each(FixtureName)('fixture %s', (fixture) => {
  test('NodeFixtureRepository loads without error', async ({ expect }) => {
    const repo = new NodeFixtureRepository(fixture);
    await expect(repo.loadAllRoutes()).resolves.toBeTruthy();
  });
});
