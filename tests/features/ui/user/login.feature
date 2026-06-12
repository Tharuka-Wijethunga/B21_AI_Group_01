@ui @user
Feature: User - Login UI

  # UI_USER_LOGIN_001
  Scenario: User can login with correct username and password
    Given I am on the login page
    When I enter the username "testuser"
    And I enter the password "test123"
    And I click the Login button
    Then I should be redirected to the dashboard

  # UI_USER_LOGIN_002
  Scenario: User cannot login with incorrect username or password
    Given I am on the login page
    When I enter the username "testuser"
    And I enter the password "wrongpassword"
    And I click the Login button
    Then I should remain on the login page
    And I should see the error message "Invalid username or password."

  # UI_USER_LOGIN_003
  Scenario: User sees password required validation message
    Given I am on the login page
    When I enter the username "testuser"
    And I leave the password field empty
    And I click the Login button
    Then I should remain on the login page
    And I should see the field validation message "Password is required"

  # UI_USER_LOGOUT_001
  Scenario: User sees success message after logout
    Given I am logged in as user
    When I navigate to the dashboard
    And I click the Logout button
    Then I should be redirected to the login page
    And I should see the logout success message

  # UI_USER_ACCESS_001
  Scenario: Add A Category button is not visible for User
    Given I am logged in as user
    When I navigate to the categories page
    Then the Add Category button should not be visible

  # UI_USER_DASHBOARD_001
  Scenario Outline: Navigation menu highlights the active tab for User
    Given I am logged in as user
    When I navigate to the "<page>" page
    Then the "<tab>" navigation tab should be highlighted as active

    Examples:
      | page       | tab        |
      | dashboard  | Dashboard  |
      | categories | Categories |
      | plants     | Plants     |
      | sales      | Sales      |
