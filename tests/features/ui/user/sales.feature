@ui @user @sales
Feature: User - Sales UI

  Background:
    Given I am logged in as user

  @UI_USER_SALES_001
  Scenario: Verify normal user can access sales page
    When I navigate to the sales page as user
    Then the sales page should load successfully

  @UI_USER_SALES_002
  Scenario: Verify normal user can view sales records
    When I navigate to the sales page as user
    Then the sales records table should display correctly

  @UI_USER_SALES_003
  Scenario: Verify normal user cannot see Sell button
    When I navigate to the sales page as user
    Then the Add Sale button should not be visible

  @UI_USER_SALES_004
  Scenario: Verify normal user cannot delete sales records
    When I navigate to the sales page as user
    Then the sales delete buttons should not be visible

  @UI_USER_SALES_005
  Scenario: Verify restricted sales functionality for normal users
    When I attempt to access the admin sales page as user
    Then I should see an access denied message
