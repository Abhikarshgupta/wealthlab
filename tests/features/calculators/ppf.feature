@smoke @regression @tax @calculator-ppf
Feature: PPF Calculator
  Public Provident Fund calculator with yearly contributions, 15-year lock-in,
  step-up option, and EEE tax treatment.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-ppf
  Scenario: PPF-01 Calculator loads with documented default values
    Given I open the PPF calculator
    Then the yearly investment should be 10000
    And the investment tenure should be 15 years
    And the interest rate should match the current PPF rate
    And the results panel should be visible

  @smoke @calculator-ppf
  Scenario: PPF-02 Results update in real time without Calculate button
    Given I open the PPF calculator
    When I set yearly investment to 50000
    Then the maturity amount should update without clicking calculate

  @smoke @tax @calculator-ppf
  Scenario: PPF-03 Results panel shows Money in Hand (post-tax)
    Given I open the PPF calculator
    Then the results panel should show money in hand

  @tax @calculator-ppf
  Scenario: PPF-04 Tax breakdown visible with rule explanation
    Given I open the PPF calculator
    Then the info panel should explain PPF EEE tax benefits
    And no income tax should be deducted from maturity

  @tax @calculator-ppf
  Scenario: PPF-05 Inflation toggle affects spending power when ON
    Given I open the PPF calculator
    And inflation adjustment is on
    When I set yearly investment to 100000
    Then the spending power amount should be less than maturity value

  @smoke @calculator-ppf
  Scenario: PPF-06 Evolution table shows year-wise breakdown
    Given I open the PPF calculator
    Then the evolution table should show 15 year rows

  @smoke @calculator-ppf
  Scenario: PPF-07 Info panel shows current rate and last updated
    Given I open the PPF calculator
    Then the info panel should show current PPF interest rate
    And the info panel should show last updated date

  @edge @calculator-ppf
  Scenario: PPF-08 Invalid min amount shows inline validation error
    Given I open the PPF calculator
    When I set yearly investment to 499
    Then I should see validation error containing "Minimum investment is"

  @edge @calculator-ppf
  Scenario: PPF-09 Invalid max amount shows inline validation error
    Given I open the PPF calculator
    When I set yearly investment to 150001
    Then I should see validation error containing "Maximum investment is"

  @edge @calculator-ppf
  Scenario: PPF-10 Zero or empty input does not crash
    Given I open the PPF calculator
    When I clear yearly investment
    Then the calculator should not crash
    And the results panel should show empty state or validation

  @edge @calculator-ppf
  Scenario: PPF-11 Negative input rejected or clamped
    Given I open the PPF calculator
    When I set yearly investment to -1000
    Then I should see a validation error or clamped minimum value

  @edge @calculator-ppf
  Scenario: PPF-12 Non-numeric input rejected
    Given I open the PPF calculator
    When I enter non-numeric yearly investment "abc"
    Then I should see a validation error or unchanged numeric value

  @edge @calculator-ppf
  Scenario: PPF-13 Extremely large value handled without overflow
    Given I open the PPF calculator
    When I set yearly investment to 999999999
    Then I should see validation error containing "Maximum investment is"

  @regression @tax @calculator-ppf
  Scenario Outline: PPF-14 Golden calculation matches reference value
    Given I open the PPF calculator
    When I enter calculator inputs from golden "<goldenId>"
    Then the maturity amount should match golden "<goldenId>" within tolerance
    And the total invested should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId    |
      | PPF-14      |
      | PPF-14-max  |

  @edge @calculator-ppf
  Scenario: PPF-15 Pie chart renders investment breakdown
    Given I open the PPF calculator
    Then the pie chart should render or show graceful fallback

  @edge @calculator-ppf
  Scenario: PPF-20 Yearly investment capped at 1.5 lakh validation
    Given I open the PPF calculator
    When I set yearly investment to 150000
    Then I should not see validation error for maximum investment
    When I set yearly investment to 150001
    Then I should see validation error containing "Maximum investment is"

  @edge @calculator-ppf
  Scenario: PPF-21 Minimum 500 per year validation
    Given I open the PPF calculator
    When I set yearly investment to 500
    Then I should not see validation error for minimum investment
    When I set yearly investment to 499
    Then I should see validation error containing "Minimum investment is"

  @regression @calculator-ppf
  Scenario: PPF-22 Step-up yearly increase reflected in maturity
    Given I open the PPF calculator
    When I enable step-up investment at 10 percent
    Then the maturity amount should match golden "PPF-22" within tolerance
    And the maturity amount should be greater than the flat PPF-14 baseline

  @smoke @calculator-ppf
  Scenario: PPF-23 Fifteen-year default tenure
    Given I open the PPF calculator
    Then the investment tenure should be 15 years
    And the info panel should mention 15 year lock-in

  @tax @regression @calculator-ppf
  Scenario: PPF-24 Maturity is tax-free EEE post-tax equals nominal
    Given I open the PPF calculator
    When I enter calculator inputs from golden "PPF-24"
    Then the money in hand amount should match golden "PPF-24" within tolerance
    And the tax deducted should be zero

  @wip @known-bug @calculator-ppf
  Scenario: PPF-25 Partial withdrawal and loan not yet implemented
    Given I open the PPF calculator
    Then partial withdrawal controls should be visible
    # @wip — feature documented in info panel only; calculator UI not built
