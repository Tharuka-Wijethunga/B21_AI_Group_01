@ui @admin
Feature: Admin - Dashboard UI

  Background:
    Given I am logged in as admin

  Scenario: Admin can navigate to categories from dashboard
    When I navigate to the dashboard
    And I click the categories navigation link
    Then I should be redirected to "/categories"
