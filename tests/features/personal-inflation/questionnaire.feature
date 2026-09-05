@personal-inflation
Feature: Personal inflation interview
  As a household in an Indian city
  I want a short interview without rupees
  So that the engine can build my mix and lived flags

  Background:
    Given I am on the personal inflation page

  @smoke @personal-inflation
  Scenario: PI-01 Route loads Place through Your number
    Then I should see the personal inflation heading
    And the interview stepper should include "Place"
    And the interview stepper should include "Your number"

  @smoke @personal-inflation
  Scenario: PI-03 City maps to state urban prices not a city index
    When I pick the inflation city "Bengaluru"
    Then I should see text "We use Karnataka urban prices, not a Bengaluru index"

  @edge @personal-inflation
  Scenario: PI-04 Unlisted city still uses a state or UT
    When I choose an unlisted city and pick state "Assam"
    Then I should see text "We use Assam urban prices"

  @edge @personal-inflation
  Scenario: PI-05 Continue stays disabled until Place is answered
    Then the personal inflation continue button should be disabled

  @regression @personal-inflation
  Scenario: PI-06 Chapters 1 to 3 have no sliders or rupee fields
    Then the personal inflation interview should have no range sliders
    And the personal inflation interview should have no rupee fields

  @regression @personal-inflation
  Scenario: PI-07 EMI option shows repayment helper not housing price
    When I complete place with city "Bengaluru"
    And I open the household chapter
    Then I should see text "EMI is loan repayment, not a price"

  @regression @personal-inflation
  Scenario: PI-10 Loaded household unlocks the matching Chapter 3 beats
    When I complete place with city "Bengaluru"
    And I complete a loaded renter household through Chapter 2
    Then Chapter 3 should ask about rent
    And Chapter 3 should ask about school fees
    And Chapter 3 should ask about pet costs
    And Chapter 3 should ask about car insurance

  @regression @personal-inflation
  Scenario: PI-08 School one and two plus are exclusive in the UI
    When I complete place with city "Bengaluru"
    And I open the household chapter
    And I toggle who chip "One school-age child"
    And I toggle who chip "Two or more school-age children"
    Then only one school chip should be selected

  @smoke @personal-inflation
  Scenario: PI-09 Quiet household Chapter 3 is only the health block
    When I complete a quiet owner household through Chapter 2
    Then Chapter 3 should not ask about rent
    And Chapter 3 should not ask about school fees

  @regression @personal-inflation
  Scenario: PI-12 Chapter 3 cannot be skipped
    When I complete a quiet owner household through Chapter 2
    Then I should not be on the results step
    And the results stepper control should be disabled
