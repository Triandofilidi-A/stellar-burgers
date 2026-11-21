import { test, expect, type Page } from '@playwright/test';

const setupHAR = async (page: Page): Promise<void> => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients*',
    update: false,
  });
  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/api/auth/user*',
    update: false,
  });
  await page.routeFromHAR('./tests/hars/order.har', {
    url: '**/api/orders*',
    update: false,
  });
};

test.describe('Добавление ингредиентов в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await setupHAR(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Булки/i })).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    const fillingCard = page
      .locator('li')
      .filter({ hasText: /Говяжий метеорит/i })
      .first();

    await fillingCard.getByRole('button', { name: /Добавить/i }).click();

    const constructor = page.locator('ul[class*="elements"]');

    await expect(constructor.getByText('Говяжий метеорит')).toBeVisible();
  });

  test('добавление булки в конструктор', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: /булка/i }).first();

    const bunName = (await bunCard.locator('p').last().innerText()).trim();

    await bunCard.getByRole('button', { name: /Добавить/i }).click();
    await expect(page.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(page.getByText(`${bunName} (низ)`)).toBeVisible();
  });
});

test.describe('Модальные окна ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await setupHAR(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Булки/i })).toBeVisible();
  });

  test('открытие и закрытие модального окна ингредиента по крестику', async ({
    page,
  }) => {
    const targetCard = page
      .locator('li')
      .filter({ hasText: /Говяжий метеорит/i })
      .first();

    const ingredientName = (await targetCard.locator('p').last().innerText()).trim();
    await targetCard.locator('a').click();

    const modals = page.locator('#modals');
    await expect(
      modals.getByRole('heading', { name: ingredientName, exact: true })
    ).toBeVisible();
    await expect(modals.getByText('Калории, ккал')).toBeVisible();
    await modals.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modals).toBeEmpty();
  });

  test('закрытие модального окна ингредиента по клику на оверлей', async ({ page }) => {
    const targetCard = page
      .locator('li')
      .filter({ hasText: /Соус фирменный Space Sauce/i })
      .first();

    const ingredientName = (await targetCard.locator('p').last().innerText()).trim();

    await targetCard.locator('a').click();

    const modals = page.locator('#modals');
    await expect(
      modals.getByRole('heading', { name: ingredientName, exact: true })
    ).toBeVisible();
    await expect(modals.getByText('Калории, ккал')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modals).toBeEmpty();
  });
});

test.describe('Создание заказа', () => {
  const fakeAuth = async ({
    page,
    context,
  }: {
    page: import('@playwright/test').Page;
    context: import('@playwright/test').BrowserContext;
  }): Promise<void> => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
  };

  test.beforeEach(async ({ page, context }) => {
    await setupHAR(page);
    await fakeAuth({ page, context });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Булки/i })).toBeVisible();
  });

  test('успешное оформление заказа и очистка конструктора', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ has: page.getByRole('button', { name: /Добавить/i }) })
      .first();
    await bunCard.getByRole('button', { name: /Добавить/i }).click();

    const fillingCard = page
      .locator('li')
      .filter({ hasText: /Говяжий метеорит/i })
      .first();
    await fillingCard.getByRole('button', { name: /Добавить/i }).click();
    await expect(page.getByText(/верх/)).toBeVisible();
    await expect(page.getByText(/низ/)).toBeVisible();

    const orderResponse = page.waitForResponse(
      (r) => r.url().includes('/api/orders') && r.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /Оформить заказ/i }).click();
    await orderResponse;
    await expect(page.getByRole('heading', { name: '1181' })).toBeVisible();
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toHaveCount(1);
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByRole('heading', { name: '1181' })).not.toBeVisible();
  });
});
