@ui @user
Feature: User - Dashboard UI

  Background:
    Given I am logged in as user

  Scenario: User sees the dashboard after login
    When I navigate to the dashboard
    Then I should see the summary statistics
    And I should see the navigation menu

  Scenario: User dashboard shows total plants count
    When I navigate to the dashboard
    Then I should see the total plants count

  Scenario: User dashboard shows total categories count
    When I navigate to the dashboard
    Then I should see the total categories count

  Scenario: User dashboard shows total sales count
    When I navigate to the dashboard
    Then I should see the total sales count

  Scenario: User can navigate to plants from dashboard
    When I navigate to the dashboard
    And I click the plants navigation link
    Then I should be redirected to "/plants"
