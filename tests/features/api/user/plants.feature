@api @user @plants
Feature: User - Plants API
  As a normal user, I have read-only access to the plants API and cannot mutate it.
  Test cases authored by 215531F.

  Background:
    Given I am authenticated as user

  @API_USER_PLANT_001
  Scenario: User can retrieve a plant by ID
    When I request the plant with id 1
    Then the response status should be 200
    And the plant response should have id, name, price, quantity and category

  @API_USER_PLANT_002
  Scenario: User can search plants with pagination
    When I search plants by name "Aloe" on page 0 with size 10
    Then the response status should be 200
    And the paged response should contain totalPages, totalElements and content
    And the paged content should include a plant named "Aloe Vera"

  @API_USER_PLANT_003
  Scenario: User cannot create a plant
    When I create a plant "TestPlant" with price 100.00 and quantity 5 under category 5
    Then the response status should be 403

  @API_USER_PLANT_004
  Scenario: User cannot update a plant
    When I update plant 1 with name "Hacked", price 1.00, quantity 1 and category 5
    Then the response status should be 403

  @API_USER_PLANT_005
  Scenario: User cannot delete a plant
    When I delete plant 1
    Then the response status should be 403
