import { Page, Locator, expect } from '@playwright/test'

export class SalesPage {
  private readonly addBtn: Locator
  private readonly plantSelect: Locator
  private readonly quantityInput: Locator
  private readonly submitBtn: Locator
  private readonly salesList: Locator
  private readonly pageTitle: Locator

  constructor(private readonly page: Page) {
    this.addBtn        = page.locator('[data-cy=add-sale-btn], a:has-text("Sell Plant"), a[href="/ui/sales/new"]')
    this.plantSelect   = page.locator('[data-cy=sale-plant-select], select[name="plantId"]')
    this.quantityInput = page.locator('[data-cy=sale-quantity-input], input[name="quantity"]')
    this.submitBtn     = page.locator('[data-cy=submit-btn], form button:has-text("Sell")')
    this.salesList     = page.locator('[data-cy=sales-list], .sales-list, table tbody')
    this.pageTitle     = page.locator('[data-cy=sales-page-title], h1, h2').filter({ hasText: /sales/i })
  }

  async navigate(): Promise<void> {
    await this.page.goto('/ui/sales')
  }

  async navigateAsUser(): Promise<void> {
    await this.page.goto('/ui/sales')
  }

  async navigateToAdminAsUser(): Promise<void> {
    await this.page.goto('/ui/sales/new')
  }

  async expectPageLoaded(): Promise<void> {
    await this.page.waitForURL(/\/sales/)
    await this.salesList.waitFor({ state: 'visible' })
  }

  async expectSalesTableDisplayed(): Promise<void> {
    await this.salesList.waitFor({ state: 'visible' })
    const count = await this.salesList.locator('tr').count()
    expect(count).toBeGreaterThan(0)
  }

  async clickAddSale(): Promise<void> {
    await this.addBtn.click()
  }

  async selectPlant(plantName: string): Promise<void> {
    const options = this.plantSelect.locator('option')
    const count = await options.count()
    for (let i = 0; i < count; i++) {
      const text = (await options.nth(i).textContent())?.trim() ?? ''
      if (text.startsWith(plantName)) {
        const value = await options.nth(i).getAttribute('value')
        await this.plantSelect.selectOption(value ?? '')
        return
      }
    }
    throw new Error(`Plant "${plantName}" not found in select options`)
  }

  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.clear()
    await this.quantityInput.fill(quantity)
  }

  async submit(): Promise<void> {
    await this.submitBtn.click()
    await this.page.waitForLoadState('networkidle')
  }

  async expectListContains(text: string): Promise<void> {
    await this.salesList.getByText(text).first().waitFor({ state: 'visible' })
  }

  async expectSuccessToast(): Promise<void> {
    await this.page.waitForURL(/\/ui\/sales$/)
  }

  async getSalesCount(): Promise<number> {
    return await this.salesList.locator('tr').count()
  }

  async countRowsForPlant(plantName: string): Promise<number> {
    return await this.salesList.locator('tr', { hasText: plantName }).count()
  }

  async clickDeleteForPlant(plantName: string): Promise<string> {
    const row = this.salesList.locator('tr', { hasText: plantName }).first()
    const form = row.locator('form[action^="/ui/sales/delete/"]')
    const formAction = await form.getAttribute('action')
    this.page.once('dialog', (dialog) => dialog.accept())
    await form.locator('[data-cy=delete-btn], button').click()
    return formAction ?? ''
  }

  async confirmDelete(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  async expectSaleFormRemoved(formAction: string): Promise<void> {
    await this.page.waitForTimeout(300)
    const count = await this.page.locator(`form[action="${formAction}"]`).count()
    expect(count).toBe(0)
  }

  async expectAccessDenied(): Promise<void> {
    const denied = this.page.getByText(/access denied|403|forbidden|not authorized|unauthorized|permission/i)
    const loginRedirect = this.page.locator('input[name="username"], input[name="email"], [data-cy=login-form]')
    await Promise.race([
      denied.first().waitFor({ state: 'visible' }),
      loginRedirect.first().waitFor({ state: 'visible' }),
      this.page.waitForURL(/login|unauthorized|403/),
    ])
  }

  async expectFormValidationError(): Promise<void> {
    const errorLocator = this.page.locator(
      '.invalid-feedback, [role="alert"], .error-message, .text-danger, :invalid'
    )
    await expect(errorLocator.first()).toBeVisible()
  }

  async expectSaleNotAdded(): Promise<void> {
    await expect(this.submitBtn).toBeVisible()
  }
}
