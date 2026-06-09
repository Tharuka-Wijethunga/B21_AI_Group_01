@ui @user
Feature: User - Sales UI

  Background:
    Given I am logged in as user

  Scenario: User sees the sales list
    When I navigate to the sales page as user
    Then I should see a list of sales

  Scenario: User can add a new sale
    When I navigate to the sales page as user
    And I click Add Sale
    And I select the plant "Peace Lily"
    And I fill in the sale quantity "1"
    And I submit the form
    Then I should see a success message

  Scenario: User sees sale total prices in the list
    When I navigate to the sales page as user
    Then I should see the sales list with quantities and total prices

  Scenario: User cannot delete a sale
    When I navigate to the sales page as user
    Then the delete buttons should not be visible

  Scenario: User cannot add a sale with invalid quantity
    When I navigate to the sales page as user
    And I click Add Sale
    And I select the plant "Haworthia"
    And I fill in the sale quantity "0"
    And I submit the form
    Then I should see a validation error
