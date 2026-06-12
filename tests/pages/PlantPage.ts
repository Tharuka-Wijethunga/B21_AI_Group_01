import { Page, Locator } from 'playwright'

// Page object for the Plant pages.
// /ui/plants is the list, /ui/plants/add is the create form,
// /ui/plants/edit/{id} is the edit form.
export class PlantPage {
  private readonly searchInput: Locator
  private readonly searchButton: Locator
  private readonly addPlantLink: Locator
  private readonly nameInput: Locator
  private readonly categorySelect: Locator
  private readonly priceInput: Locator
  private readonly quantityInput: Locator
  private readonly saveButton: Locator
  private readonly cancelLink: Locator
  private readonly formError: Locator
  private readonly emptyState: Locator

  constructor(private readonly page: Page) {
    // list page
    this.searchInput  = page.locator('input[name="name"]')
    this.searchButton = page.locator('button:has-text("Search")')
    this.addPlantLink = page.locator('a.btn:has-text("Add a Plant")')
    this.emptyState   = page.locator('td:has-text("No plants found")')

    // add / edit form
    this.nameInput      = page.locator('#name')
    this.categorySelect = page.locator('#categoryId')
    this.priceInput     = page.locator('#price')
    this.quantityInput  = page.locator('#quantity')
    this.saveButton     = page.locator('button:has-text("Save")')
    this.cancelLink     = page.locator('a:has-text("Cancel")')
    this.formError      = page.locator('div.text-danger')
  }

  // wait for the next page to finish loading after a click/submit
  private async settle(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
  }

  async navigate(): Promise<void> {
    await this.page.goto('/ui/plants', { waitUntil: 'domcontentloaded' })
  }

  async openAddForm(): Promise<void> {
    await this.page.goto('/ui/plants/add', { waitUntil: 'domcontentloaded' })
  }

  async clickAddPlant(): Promise<void> {
    await this.addPlantLink.click()
    await this.settle()
  }

  async clickCancel(): Promise<void> {
    await this.cancelLink.click()
    await this.settle()
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name)
  }

  async fillPrice(price: string): Promise<void> {
    await this.priceInput.fill(price)
  }

  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity)
  }

  async selectCategory(categoryName: string): Promise<void> {
    await this.categorySelect.selectOption({ label: categoryName })
  }

  // fills whatever fields are passed, then clicks Save
  async submitNewPlant(opts: {
    name?: string
    category?: string
    price?: string
    quantity?: string
  }): Promise<void> {
    if (opts.name !== undefined) await this.fillName(opts.name)
    if (opts.category !== undefined) await this.selectCategory(opts.category)
    if (opts.price !== undefined) await this.fillPrice(opts.price)
    if (opts.quantity !== undefined) await this.fillQuantity(opts.quantity)
    await this.saveButton.click()
    await this.settle()
  }

  async save(): Promise<void> {
    await this.saveButton.click()
    await this.settle()
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term)
    await this.searchButton.click()
    await this.settle()
  }

  // table row that contains the given plant name
  rowFor(name: string): Locator {
    return this.page.locator('tbody tr', { hasText: name })
  }

  async clickEditFor(name: string): Promise<void> {
    await this.rowFor(name).locator('a[title="Edit"]').click()
    await this.settle()
  }

  getAddPlantLink(): Locator {
    return this.addPlantLink
  }

  getEditButtons(): Locator {
    return this.page.locator('tbody a[title="Edit"]')
  }

  getDeleteButtons(): Locator {
    return this.page.locator('tbody button[title="Delete"]')
  }

  // the red "Low" badge shown in a plant's row when its quantity is below 5
  lowBadgeFor(name: string): Locator {
    return this.rowFor(name).locator('span.badge.bg-danger')
  }

  getFormError(): Locator {
    return this.formError
  }

  getEmptyState(): Locator {
    return this.emptyState
  }
}
