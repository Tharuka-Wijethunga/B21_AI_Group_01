@api @admin @categories
Feature: Admin - Categories API

  Background:
    Given I am authenticated as admin

  Scenario: Admin can retrieve all categories
    When I send a GET request to "/api/categories"
    Then the response status should be 200
    And the response should return a list
    And the response list should not be empty

  Scenario: Admin can create a new category
    When I send a POST request to "/api/categories" with body from fixture "newCategory"
    Then the response status should be 201
    And the response body should contain the created category name

  @extra
  Scenario: Admin can retrieve a category by ID
    When I send a GET request to "/api/categories/1"
    Then the response status should be 200
    And the response body should have an "id" field

  Scenario: Admin can update a category
    When I send a PUT request to "/api/categories/1" with body from fixture "updatedCategory"
    Then the response status should be 200
    And the response body should contain the updated category name

  Scenario: Admin can delete a category
    When I send a DELETE request to "/api/categories/1"
    Then the response status should be 204
    When I send a GET request to "/api/categories/1"
    Then the response status should be 404

  Scenario: Admin cannot create a category with an empty name
    When I send a POST request to "/api/categories" with an empty name
    Then the response status should be 400
