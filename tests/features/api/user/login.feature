@api @user
Feature: User - Login API

  # API_USER_LOGIN_001
  Scenario: User can login using valid credentials
    When I send a POST request to "/api/auth/login" with user credentials
    Then the response status should be 200
    And the response body should contain a valid JWT token

  # API_USER_LOGIN_002
  Scenario: User cannot login using invalid credentials
    When I send a POST request to "/api/auth/login" with invalid user credentials
    Then the response status should be 401

  # API_USER_CATEGORIES_001
  Scenario: User can retrieve category summary information
    Given I am authenticated as user
    When I send a GET request to "/api/categories/summary"
    Then the response status should be 200
    And the response body should have a "mainCategories" field

  # API_USER_PLANTS_001
  Scenario: User can retrieve plant summary information
    Given I am authenticated as user
    When I send a GET request to "/api/plants/summary"
    Then the response status should be 200
    And the response body should have a "totalPlants" field

  # API_USER_SALES_001
  Scenario: User can retrieve sales summary information
    Given I am authenticated as user
    When I send a GET request to "/api/sales"
    Then the response status should be 200
    And the response should return a list
