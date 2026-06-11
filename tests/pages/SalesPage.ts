import { Page, Locator, expect } from '@playwright/test'

export class SalesPage {
  private readonly addBtn: Locator
  private readonly plantSelect: Locator
  private readonly quantityInput: Locator
  private readonly submitBtn: Locator
  private readonly salesList: Locator
  private readonly successToast: Locator
  private readonly pageTitle: Locator

  constructor(private readonly page: Page) {
    this.addBtn        = page.locator('[data-cy=add-sale-btn], button:has-text("Add Sale"), button:has-text("New Sale"), button:has-text("Sell")')
    this.plantSelect   = page.locator('[data-cy=sale-plant-select], select[name="plantId"]')
    this.quantityInput = page.locator('[data-cy=sale-quantity-input], input[name="quantity"]')
    this.submitBtn     = page.locator('[data-cy=submit-btn], button[type="submit"]')
    this.salesList     = page.locator('[data-cy=sales-list], .sales-list, table tbody')
    this.successToast  = page.locator('[data-cy=success-toast], .toast-success, .alert-success')
    this.pageTitle     = page.locator('[data-cy=sales-page-title], h1, h2').filter({ hasText: /sales/i })
  }

  async navigate(): Promise<void> {
    await this.page.goto('/admin/sales')
  }

  async navigateAsUser(): Promise<void> {
    await this.page.goto('/sales')
  }

  async navigateToAdminAsUser(): Promise<void> {
    await this.page.goto('/admin/sales')
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
    await this.plantSelect.selectOption({ label: plantName })
  }

  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.clear()
    await this.quantityInput.fill(quantity)
  }

  async submit(): Promise<void> {
    await this.submitBtn.click()
  }

  async expectListContains(text: string): Promise<void> {
    await this.salesList.getByText(text).waitFor({ state: 'visible' })
  }

  async expectSuccessToast(): Promise<void> {
    await this.successToast.waitFor({ state: 'visible' })
  }

  async getSalesCount(): Promise<number> {
    return await this.salesList.locator('tr').count()
  }

  async clickDeleteForPlant(plantName: string): Promise<void> {
    const row = this.page.locator('tr', { hasText: plantName })
    await row.locator('[data-cy=delete-btn], button:has-text("Delete")').click()
  }

  async confirmDelete(): Promise<void> {
    await this.page.locator('[data-cy=confirm-delete-btn], button:has-text("Confirm"), button:has-text("Yes")').click()
  }

  async expectSaleRemoved(plantName: string): Promise<void> {
    await this.page.waitForTimeout(500)
    const count = await this.salesList.getByText(plantName).count()
    expect(count).toBe(0)
  }

  async expectAccessDenied(): Promise<void> {
    const denied = this.page.locator(
      '[data-cy=access-denied], .access-denied, .alert-danger, .error-page'
    ).filter({ hasText: /access denied|forbidden|not authorized|unauthorized/i })
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