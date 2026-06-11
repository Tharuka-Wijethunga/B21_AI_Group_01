@ui @admin @categories
Feature: Admin - Category Management UI

  Background:
    Given I am logged in as admin

  Scenario: Admin sees the category list
    When I navigate to the categories page
    Then I should see a list of categories

  Scenario: Admin can add a new category
    When I navigate to the categories page
    And I click Add Category
    And I fill in the category name with fixture data "newCategoryUi"
    And I submit the form
    Then I should see the new category in the list

  Scenario: Admin can add a sub-category under a parent
    When I navigate to the categories page
    And I click Add Category
    And I fill in the category name with "Roses"
    And I select a parent category
    And I submit the form
    Then I should be redirected to the categories page
    And I should see "Roses" listed under the selected parent category

  @extra
  Scenario: Admin can edit an existing category
    When I navigate to the categories page
    And I click edit for the category "Tropical"
    And I fill in the category name with "Tropicals"
    And I submit the form
    Then I should see a success message

  Scenario: Admin can delete a category
    When I navigate to the categories page
    And I click delete for the category "Roses"
    And I confirm the deletion
    Then I should see a success message

  Scenario: Admin cannot add a category with an empty name
    When I navigate to the categories page
    And I click Add Category
    And I submit the form without a name
    Then I should see a validation error
