@ui @user
Feature: User - Plant Management UI

  Background:
    Given I am logged in as user

  Scenario: User sees the plant list
    When I navigate to the plants page
    Then I should see a list of plants

  Scenario: User can view a plant in the list
    When I navigate to the plants page
    Then I should see "Aloe Vera" in the plant list

  Scenario: User does not see Add Plant button
    When I navigate to the plants page
    Then the Add Plant button should not be visible

  Scenario: User does not see Edit button on plants
    When I navigate to the plants page
    Then the edit buttons should not be visible

  Scenario: User does not see Delete button on plants
    When I navigate to the plants page
    Then the delete buttons should not be visible
