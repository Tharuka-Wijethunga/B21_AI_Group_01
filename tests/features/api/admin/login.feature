@api @admin
Feature: Admin - Login API

  # API_ADMIN_LOGIN_001
  Scenario: Admin can login using valid credentials
    When I send a POST request to "/api/auth/login" with admin credentials
    Then the response status should be 200
    And the response body should contain a valid JWT token

  # API_ADMIN_LOGIN_002
  Scenario: Admin cannot login using invalid credentials
    When I send a POST request to "/api/auth/login" with invalid admin credentials
    Then the response status should be 401

  # API_ADMIN_HEALTH_001
  Scenario: Admin can check application health status
    Given I am authenticated as admin
    When I send a GET request to "/api/health"
    Then the response status should be 200

  # API_ADMIN_CATEGORIES_001
  Scenario: Admin can retrieve category summary information
    Given I am authenticated as admin
    When I send a GET request to "/api/categories/summary"
    Then the response status should be 200
    And the response body should have a "mainCategories" field

  # API_ADMIN_PLANTS_001
  Scenario: Admin can retrieve plant summary information
    Given I am authenticated as admin
    When I send a GET request to "/api/plants/summary"
    Then the response status should be 200
    And the response body should have a "totalPlants" field
