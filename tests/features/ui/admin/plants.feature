@ui @admin
Feature: Admin - Plant Management UI

  Background:
    Given I am logged in as admin

  Scenario: Admin sees the plant list
    When I navigate to the plants page
    Then I should see a list of plants

  Scenario: Admin can add a new plant
    When I navigate to the plants page
    And I click Add Plant
    And I fill in the plant details with fixture data "newPlant"
    And I submit the form
    Then I should see the new plant in the list

  Scenario: Admin can edit an existing plant price
    When I navigate to the plants page
    And I click edit for the plant "Hibiscus"
    And I update the price to "27.00"
    And I submit the form
    Then I should see a success message

  Scenario: Admin can delete a plant
    When I navigate to the plants page
    And I click delete for the plant "Neoregelia"
    And I confirm the deletion
    Then I should see a success message

  Scenario: Admin cannot add a plant with a negative price
    When I navigate to the plants page
    And I click Add Plant
    And I fill in the plant name "Test Plant"
    And I fill in the price "-10"
    And I submit the form
    Then I should see a validation error
