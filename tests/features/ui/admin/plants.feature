@ui @admin @plants
Feature: Admin - Plant Management UI
  As an Admin, I can create, edit and validate plants through the UI.
  Test cases authored by 215531F.

  Background:
    Given I am logged into the UI as an admin

  @UI_ADMIN_PLANT_001
  Scenario: Admin can add a new plant with valid data
    When I open the Plants page
    And I click the Add a Plant button
    And I add a plant named "Rose Bush" in category "Orchids" with price "150.00" and quantity "20"
    Then I should be on the Plants list page
    # the list is paginated, so search to find the new plant
    When I search plants for "Rose"
    Then I should see "Rose Bush" in the plant list

  @UI_ADMIN_PLANT_002
  Scenario: Cancel button discards entered data and returns to the plant list
    When I open the Add Plant page
    And I enter "Discarded Plant" as the plant name
    And I click the Cancel button
    Then I should be on the Plants list page
    And I should not see "Discarded Plant" in the plant list

  @UI_ADMIN_PLANT_003
  Scenario: Admin can edit an existing plant
    When I open the Plants page
    And I edit the plant "Neoregelia" setting quantity to "99"
    Then I should be on the Plants list page
    And the plant "Neoregelia" should show quantity "99"

  @UI_ADMIN_PLANT_004
  Scenario: Validation error when plant name is too short
    When I open the Add Plant page
    And I add a plant named "AB" in category "Orchids" with price "10.00" and quantity "5"
    Then I should remain on the Add Plant page
    And I should see the plant form error "Plant name must be between 3 and 25 characters"

  @UI_ADMIN_PLANT_005
  Scenario: Validation error when price is negative
    When I open the Add Plant page
    And I add a plant named "Cheap Plant" in category "Orchids" with price "-10" and quantity "5"
    Then I should remain on the Add Plant page
    And I should see the plant form error "Price must be greater than 0"
