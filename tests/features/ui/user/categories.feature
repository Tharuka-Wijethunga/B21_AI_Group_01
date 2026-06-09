@ui @user
Feature: User - Category Management UI

  Background:
    Given I am logged in as user

  Scenario: User sees the category list
    When I navigate to the categories page
    Then I should see a list of categories

  Scenario: User can view category details
    When I navigate to the categories page
    Then I should see "Tropical" in the category list

  Scenario: User does not see Add Category button
    When I navigate to the categories page
    Then the Add Category button should not be visible

  Scenario: User does not see Edit button on categories
    When I navigate to the categories page
    Then the edit buttons should not be visible

  Scenario: User does not see Delete button on categories
    When I navigate to the categories page
    Then the delete buttons should not be visible
