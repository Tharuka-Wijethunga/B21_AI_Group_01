import { Page, Locator } from 'playwright'

export class PlantPage {
  private readonly addBtn: Locator
  private readonly nameInput: Locator
  private readonly priceInput: Locator
  private readonly quantityInput: Locator
  private readonly categorySelect: Locator
  private readonly submitBtn: Locator
  private readonly plantList: Locator
  private readonly successToast: Locator

  constructor(private readonly page: Page) {
    this.addBtn        = page.locator('[data-cy=add-plant-btn], button:has-text("Add Plant")')
    this.nameInput     = page.locator('[data-cy=plant-name-input], input[name="name"]')
    this.priceInput    = page.locator('[data-cy=plant-price-input], input[name="price"]')
    this.quantityInput = page.locator('[data-cy=plant-quantity-input], input[name="quantity"]')
    this.categorySelect = page.locator('[data-cy=plant-category-select], select[name="categoryId"]')
    this.submitBtn     = page.locator('[data-cy=submit-btn], button[type="submit"]')
    this.plantList     = page.locator('[data-cy=plant-list], .plant-list, table tbody')
    this.successToast  = page.locator('[data-cy=success-toast], .toast-success, .alert-success')
  }

  async navigate(): Promise<void> {
    await this.page.goto('/admin/plants')
  }

  async clickAddPlant(): Promise<void> {
    await this.addBtn.click()
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.clear()
    await this.nameInput.fill(name)
  }

  async fillPrice(price: string): Promise<void> {
    await this.priceInput.clear()
    await this.priceInput.fill(price)
  }

  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.clear()
    await this.quantityInput.fill(quantity)
  }

  async selectCategory(categoryName: string): Promise<void> {
    await this.categorySelect.selectOption({ label: categoryName })
  }

  async submit(): Promise<void> {
    await this.submitBtn.click()
  }

  async expectListContains(text: string): Promise<void> {
    await this.plantList.getByText(text).waitFor({ state: 'visible' })
  }

  async clickEditFor(name: string): Promise<void> {
    const row = this.page.locator('tr', { hasText: name })
    await row.locator('[data-cy=edit-btn], button:has-text("Edit")').click()
  }

  async clickDeleteFor(name: string): Promise<void> {
    const row = this.page.locator('tr', { hasText: name })
    await row.locator('[data-cy=delete-btn], button:has-text("Delete")').click()
  }

  async confirmDelete(): Promise<void> {
    await this.page.locator('[data-cy=confirm-delete-btn], button:has-text("Confirm"), button:has-text("Yes")').click()
  }

  async expectSuccessToast(): Promise<void> {
    await this.successToast.waitFor({ state: 'visible' })
  }
}
