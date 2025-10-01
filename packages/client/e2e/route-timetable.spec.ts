import { test, expect } from '@playwright/test';

test.describe('Route Timetable', () => {
  test('opens when a route is clicked', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('article')).not.toBeVisible();
    await expect(page).toHaveTitle('Hawaii Bus Plus');

    // Open route
    const routeLink = page.getByRole('link', {
      name: '301 Waimea Shuttle Hele-On',
    });
    await routeLink.click();

    await expect(page.getByRole('article')).toBeVisible();
    await expect(routeLink).toHaveAttribute('aria-current', 'page');
    await expect(
      page.getByRole('heading', { name: 'Waimea Shuttle' }),
    ).toBeVisible();

    await expect(page).toHaveURL(/routes\/301\/$/);
    await expect(page).toHaveTitle('301 · Waimea Shuttle - Hawaii Bus Plus');

    // Close route
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('article')).not.toBeVisible();
    await expect(routeLink).not.toHaveAttribute('aria-current');
    await expect(page).toHaveTitle('Hawaii Bus Plus');
  });

  test('route contains share and fare buttons', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: '301 Waimea Shuttle Hele-On' })
      .click();

    await expect(page.getByRole('article')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Share' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Fare info' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Share' })).toHaveAttribute(
      'href',
      /\/share\/routes\/301/,
    );

    await expect(
      page.getByText(
        `Bus route operated by Hele-On (County of Hawai'i Mass Transit Agency).`,
      ),
    ).toHaveRole('paragraph');
  });
});
