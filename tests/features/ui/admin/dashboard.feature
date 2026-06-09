@ui @admin
Feature: Admin - Dashboard UI

  Background:
    Given I am logged in as admin

  Scenario: Admin sees the dashboard after login
    When I navigate to the dashboard
    Then I should see the summary statistics
    And I should see the navigation menu

  Scenario: Admin dashboard shows total plants count
    When I navigate to the dashboard
    Then I should see the total plants count

  Scenario: Admin dashboard shows total categories count
    When I navigate to the dashboard
    Then I should see the total categories count

  Scenario: Admin dashboard shows total sales count
    When I navigate to the dashboard
    Then I should see the total sales count

  Scenario: Admin can navigate to categories from dashboard
    When I navigate to the dashboard
    And I click the categories navigation link
    Then I should be redirected to "/categories"
