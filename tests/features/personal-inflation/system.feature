@personal-inflation
Feature: Personal inflation routes, persistence, and sync
  As a returning visitor
  I want my interview on this device only
  So that reload and navigation do not fork a second copy of answers

  @smoke @personal-inflation
  Scenario: PI-02 Home CTA opens /personal-inflation
    Given I am on the home page
    When I follow the personal inflation CTA
    Then the URL should be "/personal-inflation"

  @smoke @personal-inflation
  Scenario: PI-SYS-06 Header and footer use the same route
    Given I am on the home page
    Then the "My inflation" header link should go to "/personal-inflation"

  @edge @personal-inflation
  Scenario: PI-14 Start over clears persisted answers
    Given I am on the personal inflation page
    When I pick the inflation city "Mumbai"
    And I reload the personal inflation page
    And I start over the personal inflation interview
    Then the personal inflation continue button should be disabled

  @regression @personal-inflation
  Scenario: PI-SYS-02 Reload hydrates answers from localStorage
    Given I am on the personal inflation page
    When I pick the inflation city "Lucknow"
    And I reload the personal inflation page
    Then I should see text "We use Uttar Pradesh urban prices, not a Lucknow index"
    And the URL should be "/personal-inflation"

  @regression @personal-inflation
  Scenario: PI-SYS-07 Leaving the route and returning keeps answers
    Given I am on the personal inflation page
    When I pick the inflation city "Chennai"
    And I navigate to the home page
    And I follow the personal inflation CTA
    Then I should see text "We use Tamil Nadu urban prices"

  @regression @personal-inflation
  Scenario: PI-SYS-08 Step lives in the store not in the URL
    Given I hydrate the interview from golden "PI-23" at the results step
    Then the URL should be "/personal-inflation"
    And the URL should not contain a results query string

  @edge @personal-inflation
  Scenario: PI-SYS-01 localStorage does not store overlay or cached π
    Given I hydrate the interview from golden "PI-23" at the results step
    Then personal inflation localStorage should not contain overlay or pi fields
