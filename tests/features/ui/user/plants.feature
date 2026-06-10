@ui @user @plants
Feature: User - Plant Management UI
  As a normal user, I have read-only access to plants and cannot manage them.
  Test cases authored by 215531F.

  Background:
    Given I am logged into the UI as a normal user

  @UI_USER_PLANT_001
  Scenario: Add a Plant button is hidden for a normal user
    When I open the Plants page
    Then the Add a Plant button should not be visible

  @UI_USER_PLANT_002
  Scenario: Edit and Delete actions are hidden for a normal user
    When I open the Plants page
    Then the plant Edit buttons should not be visible
    And the plant Delete buttons should not be visible

  @UI_USER_PLANT_003
  Scenario: Low stock badge is shown for plants with quantity below 5
    When I open the Plants page
    Then the plant "Mini Fern" should display a "Low" stock badge

  @UI_USER_PLANT_004
  Scenario: Searching by plant name filters the list
    When I open the Plants page
    And I search plants for "Aloe"
    Then I should see "Aloe Vera" in the plant list
    And I should not see "Hibiscus" in the plant list

  @UI_USER_PLANT_005
  Scenario: No plants found message shown when search has no results
    When I open the Plants page
    And I search plants for "Zzzznoplant"
    Then I should see the "No plants found" message
