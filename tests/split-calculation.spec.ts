import { test, expect } from '@playwright/test';

// TODO: Fix failing test. Implement more cleanly
test.skip('split calculation end-to-end test', async ({ page }) => {
  await page.goto('http://localhost:3000/calculator');

  // Add two items
  await page.getByText('Enter more items').click();
  await page.locator('input[placeholder="Enter name"]').last().fill('Pizza');
  await page.locator('input[placeholder="0.00"]').last().fill('50');

  await page.getByText('Enter more items').click();
  await page.locator('input[placeholder="Enter name"]').last().fill('Coke');
  await page.locator('input[placeholder="0.00"]').last().fill('10');

  // Add two homies
  await page.getByText('Enter more homies').click();
  await page.locator('input[placeholder="Enter name"]').last().fill('Alice');
  await page.getByText('Enter more homies').click();
  await page.locator('input[placeholder="Enter name"]').last().fill('Bob');

  // Verify initial percentage split
  await expect(page.locator('input[placeholder="50.00"]').first()).toHaveValue('50.00');
  await expect(page.locator('input[placeholder="50.00"]').last()).toHaveValue('50.00');

  // Manually change one percentage
  await page.locator('input[placeholder="50.00"]').first().fill('60');

  // Add a third homie
  await page.getByText('Enter more homies').click();
  await page.locator('input[placeholder="Enter name"]').last().fill('Charlie');

  // Verify that the manually set percentage is unchanged and the other two are recalculated
  await expect(page.locator('input[value="60"]')).toBeVisible();
  await expect(page.locator('input[placeholder="33.33"]').nth(1)).toHaveValue('20.00');
  await expect(page.locator('input[placeholder="33.33"]').last()).toHaveValue('20.00');

  // Click "Oblicz"
  await page.getByRole('button', { name: 'Oblicz' }).click();

  // Verify that the calculation result is displayed
  await expect(page.getByText('Do podziału : 60.00 PLN')).toBeVisible();
  await expect(page.getByText('Alice: 36.00 PLN')).toBeVisible();
  await expect(page.getByText('Bob: 12.00 PLN')).toBeVisible();
  await expect(page.getByText('Charlie: 12.00 PLN')).toBeVisible();
});
