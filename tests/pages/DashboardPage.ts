import { Page, Locator } from 'playwright'
import { expect } from '@playwright/test'


export class DashboardPage {
  private readonly statsWidget: Locator
  private readonly navMenu: Locator
  private readonly totalPlantsCard: Locator
  private readonly totalCategoriesCard: Locator
  private readonly totalSalesCard: Locator

  constructor(private readonly page: Page) {
    this.statsWidget         = page.locator('[data-cy=stats-widget], .dashboard-card')
    this.navMenu             = page.locator('[data-cy=nav-menu], nav, .sidebar')
    this.totalPlantsCard     = page.locator('[data-cy=total-plants], .total-plants')
    this.totalCategoriesCard = page.locator('[data-cy=total-categories], .total-categories')
    this.totalSalesCard      = page.locator('[data-cy=total-sales], .total-sales')
  }

  async navigate(): Promise<void> {
    await this.page.goto('/ui/dashboard')
  }

  async expectStatsVisible(): Promise<void> {
    await this.statsWidget.first().waitFor({ state: 'visible' })
  }

  async expectNavMenuVisible(): Promise<void> {
    await this.navMenu.waitFor({ state: 'visible' })
  }

  async expectTotalPlantsVisible(): Promise<void> {
    await this.totalPlantsCard.waitFor({ state: 'visible' })
  }

  async expectTotalCategoriesVisible(): Promise<void> {
    await this.totalCategoriesCard.waitFor({ state: 'visible' })
  }

  async expectTotalSalesVisible(): Promise<void> {
    await this.totalSalesCard.waitFor({ state: 'visible' })
  }

  async expectNavTabActive(tabLabel: string): Promise<void> {
    const activeLink = this.page.locator(
      'nav a.active, .sidebar a.active, [data-cy=nav-menu] a.active, ' +
      'nav li.active a, .navbar-nav .active a, .nav-link.active'
    ).filter({ hasText: new RegExp(tabLabel, 'i') })

    await activeLink.first().waitFor({ state: 'visible', timeout: 8000 })
    await expect(activeLink.first()).toBeVisible()
  }
}
