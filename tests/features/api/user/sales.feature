@api @user @sales
Feature: User - Sales API

  @API_USER_SALES_001
  Scenario: Verify normal user can retrieve sales records
    Given I am authenticated as user
    When I send a GET request to "/api/sales"
    Then the response status should be 200
    And the response should return a list
    And the response list should not be empty

  @API_USER_SALES_002
  Scenario: Verify normal user cannot create sale
    Given I am authenticated as user
    When I send a POST request to "/api/sales" with sales data from fixture "newSale"
    Then the response status should be 403
    And the response should contain an error message

  @API_USER_SALES_003
  Scenario: Verify normal user cannot delete sales records
    Given I am authenticated as user
    When I send a DELETE request to "/api/sales/1"
    Then the response status should be 403
    And the response should contain an error message

  @API_USER_SALES_004
  Scenario: Verify unauthorized user cannot access sales API
    When I send a GET request to "/api/sales" without authentication
    Then the response status should be 401

  @API_USER_SALES_005
  Scenario: Verify restricted action error message
    Given I am authenticated as user
    When I send a POST request to "/api/sales" with quantity 1
    Then the response status should be 403
    And the response should contain an error message
