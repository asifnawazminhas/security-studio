import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('dashboard and command workflow render', async ({page}) => {
  await page.goto('/#/dashboard');
  await expect(page.getByText("Security knowledge,")).toBeVisible();

  await page.goto('/#/library');
  await expect(page.getByText('Command Library')).toBeVisible();

  await page.goto('/#/command/tshark-interface');
  await expect(page.getByText('Command Studio')).toBeVisible();
  await page.getByRole('button', {name:'Visualise'}).click();
  await expect(page.getByText('Export PNG')).toBeVisible();
});

test('appearance preference survives navigation', async ({page}) => {
  await page.goto('/#/appearance');
  const light = page.getByRole('button', {name:/Light/i}).first();
  await light.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.goto('/#/dashboard');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('notes links use safe new-tab behavior', async ({page}) => {
  await page.goto('/#/dashboard');
  const notes = page.locator('a[href^="https://notes.asifnawazminhas.com"]').first();
  await expect(notes).toHaveAttribute('target','_blank');
  await expect(notes).toHaveAttribute('rel',/noopener/);
});

test('critical pages have no serious axe violations', async ({page}) => {
  for (const route of ['/#/dashboard','/#/library','/#/visualiser','/#/appearance']) {
    await page.goto(route);
    const results = await new AxeBuilder({page}).analyze();
    const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact));
    expect(serious, `${route}: ${serious.map(v=>v.id).join(', ')}`).toEqual([]);
  }
});
