@api @user @categories
Feature: User - Categories API

  Background:
    Given I am authenticated as user

  Scenario: User can retrieve all categories
    When I send a GET request to "/api/categories"
    Then the response status should be 200
    And the response should return a list
    And the response list should not be empty

  Scenario: User can retrieve a category by ID
    When I send a GET request to "/api/categories/1"
    Then the response status should be 200
    And the response body should have an "id" field

  Scenario: User cannot create a category
    When I send a POST request to "/api/categories" with body from fixture "newCategory"
    Then the response status should be 403

  @extra
  Scenario: User cannot update a category
    When I send a PUT request to "/api/categories/1" with body from fixture "updatedCategory"
    Then the response status should be 403

  Scenario: User cannot delete a category
    When I send a DELETE request to "/api/categories/1"
    Then the response status should be 403

  Scenario: Unauthenticated request to categories API returns 401
    Given I am not authenticated
    When I send a GET request to "/api/categories"
    Then the response status should be 401
