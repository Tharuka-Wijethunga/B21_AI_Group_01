@ui @admin
Feature: Admin - Sales Management UI

  Background:
    Given I am logged in as admin

  Scenario: Admin sees the sales list
    When I navigate to the sales page
    Then I should see a list of sales

  Scenario: Admin can add a new sale
    When I navigate to the sales page
    And I click Add Sale
    And I select the plant "Hibiscus"
    And I fill in the sale quantity "3"
    And I submit the form
    Then I should see a success message

  Scenario: Admin sees sale total price calculated
    When I navigate to the sales page
    And I click Add Sale
    And I select the plant "Areca Palm"
    And I fill in the sale quantity "2"
    And I submit the form
    Then I should see the new sale in the list

  Scenario: Admin cannot add a sale with zero quantity
    When I navigate to the sales page
    And I click Add Sale
    And I select the plant "Haworthia"
    And I fill in the sale quantity "0"
    And I submit the form
    Then I should see a validation error

  Scenario: Admin can view sale details
    When I navigate to the sales page
    Then I should see the sales list with quantities and total prices
