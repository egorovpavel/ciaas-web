Feature: Visitor must be able to visit homepage
  As Visitor
  I want to visit home page
  So i can see what this page all about

  Scenario: Home page can be visited
    Given I am on home page
    Then I should see "Continuous Integration as Service"