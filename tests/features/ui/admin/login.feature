@ui @admin
Feature: Admin - Login UI

  # UI_ADMIN_LOGIN_001
  Scenario: Admin can login with correct username and password
    Given I am on the login page
    When I enter the username "admin"
    And I enter the password "admin123"
    And I click the Login button
    Then I should be redirected to the dashboard

  # UI_ADMIN_LOGIN_002
  Scenario: Admin cannot login with incorrect username or password
    Given I am on the login page
    When I enter the username "admin"
    And I enter the password "wrongpassword"
    And I click the Login button
    Then I should remain on the login page
    And I should see the error message "Invalid username or password."

  # UI_ADMIN_LOGIN_003
  Scenario: Admin sees username required validation message
    Given I am on the login page
    When I leave the username field empty
    And I enter the password "admin123"
    And I click the Login button
    Then I should remain on the login page
    And I should see the field validation message "Username is required"

  # UI_ADMIN_ACCESS_001
  Scenario: Add A Category button is visible for Admin
    Given I am logged in as admin
    When I navigate to the categories page
    Then the Add Category button should be visible

  # UI_ADMIN_ACCESS_002
  Scenario: Add A Plant button is visible for Admin
    Given I am logged in as admin
    When I navigate to the plants page
    Then the Add Plant button should be visible

  # UI_ADMIN_DASHBOARD_001
  Scenario: Admin is redirected to Dashboard after successful login
    Given I am on the login page
    When I enter the username "admin"
    And I enter the password "admin123"
    And I click the Login button
    Then I should be redirected to the dashboard
    And I should see the summary statistics
    And I should see the navigation menu
