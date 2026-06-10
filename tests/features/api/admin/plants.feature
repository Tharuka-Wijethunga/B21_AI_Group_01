@api @admin @plants
Feature: Admin - Plants API
  As an Admin, I can fully manage plants through the REST API.
  Test cases authored by 215531F.

  Background:
    Given I am authenticated as admin

  @API_ADMIN_PLANT_001
  Scenario: Admin can retrieve all plants
    When I request the list of plants
    Then the response status should be 200
    And the response should return a list
    And the response list should not be empty
    And each plant in the list should have id, name, price, quantity and category

  @API_ADMIN_PLANT_002
  Scenario: Admin can create a plant under a sub-category
    When I create a plant "Orchid" with price 250.00 and quantity 10 under category 5
    Then the response status should be 201
    And the created plant should have name "Orchid", price 250.00 and quantity 10

  @API_ADMIN_PLANT_003
  Scenario: Admin can update an existing plant
    Given I create a plant "Editable Plant" with price 100.00 and quantity 5 under category 5
    When I update the created plant with name "Orchid Updated", price 300.00, quantity 8 and category 5
    Then the response status should be 200
    And the updated plant should have name "Orchid Updated", price 300.00 and quantity 8

  @API_ADMIN_PLANT_004
  Scenario: Admin can delete a plant
    Given I create a plant "Disposable Plant" with price 10.00 and quantity 1 under category 5
    When I delete the created plant
    Then the response status should be 204
    When I request the created plant by id
    Then the response status should be 404

  @API_ADMIN_PLANT_005
  Scenario: Admin cannot create a plant with a negative price
    When I create a plant "TestPlant" with price -10 and quantity 5 under category 5
    Then the response status should be 400
    And the response error message for "price" should be "Price must be greater than 0"
