@personal-inflation
Feature: Personal inflation engine on results
  As a user who finished the interview
  I want labelled official-weighted and my estimate
  So that a loud bill is not my inflation

  Background:
    Given I am on the personal inflation page

  @smoke @regression @personal-inflation
  Scenario Outline: Engine freeze goldens render as the hero rate
    Given I hydrate the interview from golden "<id>" at the results step
    Then my inflation hero should be <display> percent
    And official-weighted should not be written to the inflation toggle

    Examples:
      | id    | display |
      | PI-20 | 4.3     |
      | PI-22 | 3.5     |
      | PI-23 | 6.7     |

  @regression @personal-inflation
  Scenario: PI-23 Lease reset does not change the published rent line
    Given I hydrate the interview from golden "PI-23" at the results step
    Then my inflation hero should be 6.7 percent
    And the page must not claim the 12 percent rent line is the official index

  @regression @personal-inflation
  Scenario: PI-24 EMI and own-no-loan show the same inflation
    Given I hydrate the interview from golden "PI-24" at the results step
    Then my inflation hero should match golden "PI-20"
