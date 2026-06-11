@ui @admin @sales
Feature: Admin - Sales Management UI

  Background:
    Given I am logged in as admin

  @UI_ADMIN_SALES_001
  Scenario: Verify admin can access sales page
    When I navigate to the sales page
    Then the sales page should load successfully

  @UI_ADMIN_SALES_002
  Scenario: Verify admin can view sales records
    When I navigate to the sales page
    Then the sales records table should display correctly

  @UI_ADMIN_SALES_003
  Scenario: Verify admin can sell a plant successfully
    When I navigate to the sales page
    And I click Add Sale
    And I select the plant from fixture "newSale"
    And I fill in the sale quantity from fixture "newSale"
    And I submit the sale form
    Then I should see a sales success message
    And the sale should be displayed in the sales records

  @UI_ADMIN_SALES_004
  Scenario: Verify admin can delete sales record
    When I navigate to the sales page
    And I click delete for the sale with plant from fixture "deleteSale"
    And I confirm the sale deletion
    Then the sale should be removed from the sales records

  @UI_ADMIN_SALES_005
  Scenario: Verify admin cannot sell with invalid quantity
    When I navigate to the sales page
    And I click Add Sale
    And I select the plant from fixture "invalidSale"
    And I fill in the sale quantity "0"
    And I submit the sale form
    Then the sale form should show a validation error
