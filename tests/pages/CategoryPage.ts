import { Page, Locator } from 'playwright'

export class CategoryPage {
  public readonly addBtn: Locator
  private readonly nameInput: Locator
  private readonly parentSelect: Locator
  private readonly submitBtn: Locator
  private readonly categoryList: Locator
  private readonly successToast: Locator
  private readonly errorToast: Locator

  constructor(private readonly page: Page) {
    this.addBtn      = page.locator('[data-cy=add-category-btn], a:has-text("Add A Category"), a:has-text("Add Category"), button:has-text("Add Category")')
    this.nameInput   = page.locator('[data-cy=category-name-input], input[name="name"]')
    this.parentSelect = page.locator('[data-cy=parent-category-select], select[name="parentId"]')
    this.submitBtn   = page.locator('[data-cy=submit-btn], button[type="submit"]')
    this.categoryList = page.locator('[data-cy=category-list], .category-list, table tbody')
    this.successToast = page.locator('[data-cy=success-toast], .toast-success, .alert-success')
    this.errorToast   = page.locator('[data-cy=error-toast], .toast-error, .alert-danger')
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
    await this.categoryList.getByText(text).first().waitFor({ state: 'visible' })
  }

  async expectListNotContains(text: string): Promise<void> {
    await this.page.waitForTimeout(500)
    const count = await this.categoryList.getByText(text).count()
    if (count !== 0) throw new Error(`Expected list to not contain "${text}" but it does`)
  }

  async clickEditFor(name: string): Promise<void> {
    const row = this.page.locator('tr', { hasText: name }).first()
    await row.locator('[data-cy=edit-btn], a:has-text("Edit"), button:has-text("Edit"), a[href*="edit"], [title="Edit"]').click()
  }

  async clickDeleteFor(name: string): Promise<void> {
    const row = this.page.locator('tr', { hasText: name }).first()
    await row.locator('[data-cy=delete-btn], a:has-text("Delete"), button:has-text("Delete"), [title="Delete"]').click()
  }

  async confirmDelete(): Promise<void> {
    await this.page.locator('#deleteModal button[type="submit"], .modal-footer button:has-text("Delete"), [data-cy=confirm-delete-btn], button:has-text("Confirm"), button:has-text("Yes")').click()
  }

  async expectSuccessToast(): Promise<void> {
    await this.successToast.waitFor({ state: 'visible' })
  }
}
