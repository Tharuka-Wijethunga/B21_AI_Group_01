@api @admin @sales
Feature: Admin - Sales API

  Background:
    Given I am authenticated as admin

  @API_ADMIN_SALES_001
  Scenario: Verify admin can retrieve sales list
    When I send a GET request to "/api/sales"
    Then the response status should be 200
    And the response should return a list
    And the response list should not be empty

  @API_ADMIN_SALES_002
  Scenario: Verify admin can create sale through API
    When I send a POST request to sell the plant from fixture "newSale"
    Then the response status should be 201
    And the response body should have a "totalPrice" field
    And I delete the sale that was just created

  @API_ADMIN_SALES_003
  Scenario: Verify admin can delete sale through API
    Given I create a sale to be deleted from fixture "newSale"
    When I delete the sale to be deleted
    Then the response status should be 204

  @API_ADMIN_SALES_004
  Scenario: Verify admin cannot create sale with invalid quantity
    When I send a POST request to sell the plant from fixture "newSale" with quantity 0
    Then the response status should be 400
    And the response should contain an error message

  @API_ADMIN_SALES_005
  Scenario: Verify admin cannot create sale with invalid plant ID
    When I send a POST request to sell the plant from fixture "invalidSalePlantId"
    Then the response should return an error
