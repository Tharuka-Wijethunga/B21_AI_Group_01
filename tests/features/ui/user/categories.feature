@ui @user @categories
Feature: User - Category Management UI

  Background:
    Given I am logged in as user

  Scenario: User sees the category list
    When I navigate to the categories page
    Then I should see a list of categories

  @extra
  Scenario: User does not see Add Category button
    When I navigate to the categories page
    Then the Add Category button should not be visible

  Scenario: Edit button is disabled for normal users
    When I navigate to the categories page
    Then the edit buttons should be disabled

  Scenario: Delete button is disabled for normal users
    When I navigate to the categories page
    Then the delete buttons should be disabled

  Scenario: User can search categories by name
    When I navigate to the categories page
    And I enter a valid category name in the search bar
    And I trigger the search
    Then the category list should show only matching categories

  Scenario: No category found message is shown when search has no results
    When I navigate to the categories page
    And I enter a non-existent category name in the search bar
    And I trigger the search
    Then I should see the message "No category found"
