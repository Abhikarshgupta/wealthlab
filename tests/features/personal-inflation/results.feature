@personal-inflation
Feature: Personal inflation results and apply
  As someone who just got a number
  I want to understand raise vs inflation and optionally apply it
  So that calculators use my estimate, not a silent 6 percent

  Background:
    Given I hydrate the interview from golden "PI-23" at the results step

  @smoke @personal-inflation
  Scenario: PI-60 Sticky hero is my inflation at one decimal
    Then my inflation hero should be 6.7 percent

  @smoke @personal-inflation
  Scenario: PI-61 Mix table uses A, B, and I = A × (B / 100)
    When I open the bills drawer
    Then the mix table should show columns A and B
    And the mix formula should be I = A × (B / 100)

  @smoke @personal-inflation
  Scenario: PI-62 Raise drawer is hike minus inflation
    Then the raise drawer should be open
    When I set the salary increase to 12 percent
    Then the real change in pay should be "5.3"
    And my inflation hero should still be 6.7 percent

  @edge @personal-inflation
  Scenario: PI-63 After tax uses this year's slab on the CTC hike
    When I set the salary increase to 12 percent
    And I open the after tax nested section
    And I choose the tax slab 30 percent
    Then the after-tax real change in pay should be "1.7"
    When I open the after-tax calculation
    Then the after-tax calculation should mention "8.4%"

  @regression @personal-inflation
  Scenario: PI-64 SIP graph stays inside its closed drawer
    Then the SIP buying-power graph should not be visible
    When I open the SIP drawer
    Then the SIP buying-power graph should be visible

  @regression @personal-inflation
  Scenario Outline: PI-65 Bills rent row only for renters
    Given I hydrate the interview from golden "<id>" at the results step
    When I open the bills drawer
    Then rent bill row visibility should be <rentVisible>

    Examples:
      | id    | rentVisible |
      | PI-23 | visible     |
      | PI-20 | hidden      |

  @edge @personal-inflation
  Scenario: PI-66 Start over from answers clears the interview
    When I click start over on results
    Then I should be on chapter 1 place
    And the personal inflation continue button should be disabled

  @regression @personal-inflation
  Scenario: PI-67 Results copy does not say MoSPI, floor, cap, or pay next year
    Then the results page must not contain "MoSPI"
    And the results page must not contain "pay next year"

  @edge @personal-inflation
  Scenario: PI-68 Results use a single narrow column with independent drawers
    Then the results shell should use a single column layout
    And the SIP drawer should be closed
    And the bills drawer should be closed

  @smoke @regression @personal-inflation
  Scenario: PI-80 Apply writes my estimate into calculators
    When I apply my inflation to calculators
    Then the global inflation rate should be 6.7
    And inflation adjustment should be on

  @regression @personal-inflation
  Scenario: PI-81 Completing the interview without apply keeps 6 percent
    Then the global inflation rate should be 6
    And inflation adjustment should be off

  @edge @personal-inflation
  Scenario: PI-82 Apply does not write CII DA or Residex storage
    When I apply my inflation to calculators
    Then preferences storage must not contain CII or Residex keys
