@api @user
Feature: User - Plants API

  Background:
    Given I am authenticated as user

  Scenario: User can retrieve all plants
    When I send a GET request to "/api/plants"
    Then the response status should be 200
    And the response should return a list
    And the response list should not be empty

  Scenario: User can retrieve a plant by ID
    When I send a GET request to "/api/plants/1"
    Then the response status should be 200
    And the response body should have an "id" field

  Scenario: User cannot create a plant
    When I send a POST request to "/api/plants" with body from fixture "newPlant"
    Then the response status should be 403

  Scenario: User cannot update a plant
    When I send a PUT request to "/api/plants/1" with body from fixture "updatedPlant"
    Then the response status should be 403

  Scenario: User cannot delete a plant
    When I send a DELETE request to "/api/plants/1"
    Then the response status should be 403
