@api @user
Feature: User - Sales API

  Background:
    Given I am authenticated as user

  Scenario: User can retrieve all sales
    When I send a GET request to "/api/sales"
    Then the response status should be 200
    And the response should return a list
    And the response list should not be empty

  Scenario: User can retrieve a sale by ID
    When I send a GET request to "/api/sales/1"
    Then the response status should be 200
    And the response body should have an "id" field

  Scenario: User can create a new sale
    When I send a POST request to "/api/sales" with body from fixture "newSale"
    Then the response status should be 201
    And the response body should have a "totalPrice" field

  Scenario: User cannot delete a sale
    When I send a DELETE request to "/api/sales/1"
    Then the response status should be 403

  Scenario: User cannot create a sale with zero quantity
    When I send a POST request to "/api/sales" with quantity 0
    Then the response status should be 400
