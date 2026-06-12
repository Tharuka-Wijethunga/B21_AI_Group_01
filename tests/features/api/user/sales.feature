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
    When I attempt to sell the plant from fixture "newSale" as the current user
    Then the response status should be 403
    And the response should contain an error message

  @API_USER_SALES_003
  Scenario: Verify normal user cannot delete sales records
    Given I create a temporary sale as admin from fixture "newSale"
    And I switch to a regular user token
    When I attempt to delete that sale as the current user
    Then the response status should be 403
    And the response should contain an error message
    And I clean up the temporary sale as admin

  @API_USER_SALES_004
  Scenario: Verify unauthorized user cannot access sales API
    When I send a GET request to "/api/sales" without authentication
    Then the response status should be 401

  @API_USER_SALES_005
  Scenario: Verify restricted action error message
    Given I create a temporary sale as admin from fixture "newSale"
    And I switch to a regular user token
    When I attempt to delete that sale as the current user
    Then the response status should be 403
    And the response should contain an error message
    And I clean up the temporary sale as admin
