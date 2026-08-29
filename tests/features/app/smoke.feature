@smoke @app
Feature: Application navigation
  As a visitor
  I want the home page to load
  So that I can reach calculators

  @regression
  Scenario: NAV-01 Home loads with hero and CTA to calculators
    Given I am on the home page
    Then I should see the hero heading
    And I should see a link to calculators
