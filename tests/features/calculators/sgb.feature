@smoke @regression @tax @calculator-sgb
Feature: SGB Calculator
  Sovereign Gold Bond calculator with gold price API, 2.5% semi-annual interest,
  user-adjustable gold appreciation, and tax-free capital gains at maturity.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-sgb
  Scenario: SGB-01 Calculator loads with documented default values
    Given I open the SGB calculator
    Then the SGB gold amount should be 10
    And the SGB tenure should be 8 years
    And the SGB gold appreciation rate should match the current SGB rate
    And the SGB results panel should be visible

  @smoke @calculator-sgb
  Scenario: SGB-02 Results update in real time without Calculate button
    Given I open the SGB calculator
    When I set SGB gold amount to 50
    Then the SGB maturity amount should update without clicking calculate

  @smoke @tax @calculator-sgb
  Scenario: SGB-03 Results panel shows Money in Hand (post-tax)
    Given I open the SGB calculator
    Then the SGB results panel should show money in hand

  @tax @calculator-sgb
  Scenario: SGB-04 Tax breakdown visible with capital gains exempt rule
    Given I open the SGB calculator
    When I enter SGB inputs from golden "SGB-26"
    Then I should see the SGB tax breakdown section
    And the SGB tax rule should mention capital gains exempt

  @tax @calculator-sgb
  Scenario: SGB-05 Inflation toggle affects spending power when ON
    Given I open the SGB calculator
    And inflation adjustment is on
    When I enter SGB inputs from golden "SGB-14"
    Then the SGB spending power should be less than money in hand

  @smoke @calculator-sgb
  Scenario: SGB-06 Evolution table shows year-wise breakdown
    Given I open the SGB calculator
    Then the SGB evolution table should show 8 year rows

  @smoke @calculator-sgb
  Scenario: SGB-07 Info panel shows fixed 2.5% rate and last updated
    Given I open the SGB calculator
    Then the SGB info panel should show fixed interest rate 2.5 percent
    And the SGB info panel should show last updated date

  @edge @calculator-sgb
  Scenario: SGB-08 Invalid min gold amount shows inline validation error
    Given I open the SGB calculator
    When I set SGB gold amount to 0
    Then I should see SGB validation error containing "Minimum gold amount is"

  @edge @calculator-sgb
  Scenario: SGB-09 Invalid max gold amount shows inline validation error
    Given I open the SGB calculator
    When I set SGB gold amount to 1001
    Then I should see SGB validation error containing "Maximum gold amount is"

  @edge @calculator-sgb
  Scenario: SGB-10 Zero or empty input does not crash
    Given I open the SGB calculator
    When I clear SGB gold amount
    Then the SGB calculator should not crash
    And the SGB results panel should show empty state or validation

  @edge @calculator-sgb
  Scenario: SGB-11 Negative input rejected or clamped
    Given I open the SGB calculator
    When I set SGB gold amount to -5
    Then I should see SGB validation error or clamped minimum value

  @edge @calculator-sgb
  Scenario: SGB-12 Non-numeric input rejected
    Given I open the SGB calculator
    When I enter non-numeric SGB gold amount "abc"
    Then I should see SGB validation error or unchanged numeric value

  @edge @calculator-sgb
  Scenario: SGB-13 Extremely large value handled without overflow
    Given I open the SGB calculator
    When I set SGB gold amount to 99999
    Then I should see SGB validation error containing "Maximum gold amount is"

  @regression @tax @calculator-sgb
  Scenario Outline: SGB-14 Golden calculation matches reference value
    Given I open the SGB calculator
    When I enter SGB inputs from golden "<goldenId>"
    Then the SGB money in hand should match golden "<goldenId>" within tolerance
    And the SGB principal invested should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId    |
      | SGB-14      |
      | SGB-14-5y   |

  @smoke @calculator-sgb
  Scenario: SGB-15 Pie chart renders investment breakdown
    Given I open the SGB calculator
    Then the SGB pie chart should render or show graceful fallback

  @regression @calculator-sgb
  Scenario: SGB-20 Semi-annual 2.5% fixed interest component matches golden
    Given I open the SGB calculator
    When I enter SGB inputs from golden "SGB-20"
    Then the SGB fixed interest amount should match golden "SGB-20" within tolerance

  @edge @calculator-sgb
  Scenario: SGB-21 Gold appreciation rate is user-adjustable
    Given I open the SGB calculator
    When I set SGB gold appreciation rate to 12
    Then the SGB money in hand should match golden "SGB-21" within tolerance

  @edge @known-bug @calculator-sgb
  Scenario: SGB-22 Real-time gold price fetch succeeds
    Given the SGB gold API returns price 7000 per gram
    When I navigate to the SGB calculator
    Then the SGB principal should reflect gold price 7000 per gram

  @edge @calculator-sgb
  Scenario: SGB-23 Gold API failure uses fallback price
    Given the SGB gold API fails
    When I navigate to the SGB calculator
    Then the SGB money in hand should match golden "SGB-23" within tolerance

  @edge @calculator-sgb
  Scenario: SGB-25 Missing gold API key uses fallback price
    Given the SGB gold API has no key
    When I navigate to the SGB calculator
    Then the SGB money in hand should match golden "SGB-23" within tolerance

  @tax @regression @calculator-sgb
  Scenario: SGB-26 Maturity is tax-free — post-tax equals nominal
    Given I open the SGB calculator
    When I enter SGB inputs from golden "SGB-26"
    Then the SGB money in hand should match golden "SGB-26" within tolerance
    And the SGB tax deducted should be zero
