import { Page, Locator } from 'playwright'

export class CategoryPage {
  private readonly addBtn: Locator
  private readonly nameInput: Locator
  private readonly parentSelect: Locator
  private readonly submitBtn: Locator
  private readonly categoryList: Locator
  private readonly successToast: Locator
  private readonly errorToast: Locator
  private readonly searchInput: Locator
  private readonly searchBtn: Locator
  private readonly emptyMessage: Locator

  constructor(private readonly page: Page) {
    this.addBtn      = page.locator('[data-cy=add-category-btn], a[href="/ui/categories/add"]')
    this.nameInput   = page.locator('[data-cy=category-name-input], input#name, input[name="name"]')
    this.parentSelect = page.locator('[data-cy=parent-category-select], select[name="parentId"]')
    this.submitBtn   = page.locator('[data-cy=submit-btn], button[type="submit"]')
    this.categoryList = page.locator('[data-cy=category-list], .category-list, table tbody')
    this.successToast = page.locator('[data-cy=success-toast], .toast-success, .alert-success')
    this.errorToast   = page.locator('[data-cy=error-toast], .toast-error, .alert-danger')
    this.searchInput  = page.locator('[data-cy=search-input], input[placeholder*="Search"]')
    this.searchBtn    = page.locator('[data-cy=search-btn], button:has-text("Search")')
    this.emptyMessage = page.locator('[data-cy=empty-message], .empty-state, td.no-data')
  }

  async navigate(): Promise<void> {
    await this.page.goto('/ui/categories')
  }

  async clickAddCategory(): Promise<void> {
    await this.addBtn.click()
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.clear()
    await this.nameInput.fill(name)
  }

  async selectParent(parentName: string): Promise<void> {
    await this.parentSelect.selectOption({ label: parentName })
  }

  async submit(): Promise<void> {
    await this.submitBtn.click()
  }

  async expectListContains(text: string): Promise<void> {
    await this.categoryList.getByText(text).waitFor({ state: 'visible' })
  }

  async expectListNotEmpty(): Promise<void> {
    await this.categoryList.locator('tr').first().waitFor({ state: 'visible' })
    const count = await this.categoryList.locator('tr').count()
    if (count === 0) throw new Error('Expected category list to contain at least one row')
  }

  async expectListNotContains(text: string): Promise<void> {
    await this.page.waitForTimeout(500)
    const count = await this.categoryList.getByText(text).count()
    if (count !== 0) throw new Error(`Expected list to not contain "${text}" but it does`)
  }

  async clickEditFor(name: string): Promise<void> {
    const row = this.page.locator('tr', { hasText: name })
    await row.locator('[data-cy=edit-btn], a[title="Edit"]').click()
  }

  async clickDeleteFor(name: string): Promise<void> {
    this.page.once('dialog', dialog => dialog.accept())
    const row = this.page.locator('tr', { hasText: name })
    await row.locator('[data-cy=delete-btn], button[title="Delete"]').click()
  }

  async confirmDelete(): Promise<void> {
    // deletion is confirmed via the native browser dialog handled in clickDeleteFor
  }

  async expectSuccessToast(): Promise<void> {
    await this.successToast.waitFor({ state: 'visible' })
  }

  async selectFirstParent(): Promise<string> {
    const options = await this.parentSelect.locator('option').all()
    const firstOption = options.find(async o => (await o.getAttribute('value')) !== '')
    const label = await (firstOption ?? options[1]).textContent() ?? ''
    await this.parentSelect.selectOption({ index: 1 })
    return label.trim()
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term)
    const btnCount = await this.searchBtn.count()
    if (btnCount > 0) {
      await this.searchBtn.click()
    } else {
      await this.searchInput.press('Enter')
    }
  }

  async expectEmptyMessage(text: string): Promise<void> {
    await this.page.getByText(text).waitFor({ state: 'visible' })
  }

  async expectFilteredResults(term: string): Promise<void> {
    const rows = await this.categoryList.locator('tr, li').all()
    for (const row of rows) {
      const text = await row.textContent() ?? ''
      if (text.trim()) {
        const lowerText = text.toLowerCase()
        const lowerTerm = term.toLowerCase()
        if (!lowerText.includes(lowerTerm)) {
          throw new Error(`Row "${text.trim()}" does not match search term "${term}"`)
        }
      }
    }
  }
}
