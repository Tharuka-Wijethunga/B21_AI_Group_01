import { Page, Locator } from 'playwright'

export class SalesPage {
  private readonly addBtn: Locator
  private readonly plantSelect: Locator
  private readonly quantityInput: Locator
  private readonly submitBtn: Locator
  private readonly salesList: Locator
  private readonly successToast: Locator

  constructor(private readonly page: Page) {
    this.addBtn       = page.locator('[data-cy=add-sale-btn], button:has-text("Add Sale"), button:has-text("New Sale"), a:has-text("Sell Plant"), a:has-text("New Sale"), a:has-text("Add Sale")')
    this.plantSelect  = page.locator('[data-cy=sale-plant-select], select[name="plantId"]')
    this.quantityInput = page.locator('[data-cy=sale-quantity-input], input[name="quantity"]')
    this.submitBtn    = page.locator('[data-cy=submit-btn], button[type="submit"]')
    this.salesList    = page.locator('[data-cy=sales-list], .sales-list, table tbody')
    this.successToast = page.locator('[data-cy=success-toast], .toast-success, .alert-success')
  }

  async navigate(): Promise<void> {
    await this.page.goto('/ui/sales')
  }

  async navigateAsUser(): Promise<void> {
    await this.page.goto('/ui/sales')
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
    await this.salesList.getByText(text).first().waitFor({ state: 'visible' })
  }

  async expectSuccessToast(): Promise<void> {
    await this.successToast.waitFor({ state: 'visible' })
  }

  async getSalesCount(): Promise<number> {
    return await this.salesList.locator('tr').count()
  }
}
