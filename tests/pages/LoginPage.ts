import { Page, Locator } from 'playwright'

export class LoginPage {
  private readonly emailInput: Locator
  private readonly passwordInput: Locator
  private readonly submitBtn: Locator
  private readonly errorMessage: Locator

  constructor(private readonly page: Page) {
    this.emailInput    = page.locator('[data-cy=email-input], input[type="email"], input[name="username"]')
    this.passwordInput = page.locator('[data-cy=password-input], input[type="password"]')
    this.submitBtn     = page.locator('[data-cy=login-btn], button[type="submit"]')
    this.errorMessage  = page.locator('[data-cy=error-message], .error-message, .alert-danger')
  }

  async navigate(): Promise<void> {
    await this.page.goto('/ui/login')
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email)
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password)
  }

  async submit(): Promise<void> {
    await this.submitBtn.click()
  }

  async login(email: string, password: string): Promise<void> {
    await this.navigate()
    await this.enterEmail(email)
    await this.enterPassword(password)
    await this.submit()
  }

  async expectErrorVisible(): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible' })
  }

  async expectRedirectedToDashboard(): Promise<void> {
    await this.page.waitForURL('**/dashboard**')
  }
}
