@api @admin
Feature: Admin - Plants API

  Background:
    Given I am authenticated as admin

  Scenario: Admin can retrieve all plants
    When I send a GET request to "/api/plants"
    Then the response status should be 200
    And the response should return a list
    And the response list should not be empty

  Scenario: Admin can create a new plant
    When I send a POST request to "/api/plants" with body from fixture "newPlant"
    Then the response status should be 201
    And the response body should contain the created plant name

  Scenario: Admin can retrieve a plant by ID
    When I send a GET request to "/api/plants/1"
    Then the response status should be 200
    And the response body should have an "id" field

  Scenario: Admin can update a plant price
    When I send a PUT request to "/api/plants/1" with body from fixture "updatedPlant"
    Then the response status should be 200
    And the response body should contain the updated plant price

  Scenario: Admin cannot create a plant with a negative price
    When I send a POST request to "/api/plants" with a negative price
    Then the response status should be 400
