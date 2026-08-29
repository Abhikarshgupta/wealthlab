@smoke @regression @tax @calculator-scss
Feature: SCSS Calculator
  Senior Citizens Savings Scheme calculator with age 60+ eligibility,
  ₹30L maximum principal, quarterly interest payout, and TDS on interest.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-scss
  Scenario: SCSS-01 Calculator loads with documented default values
    Given I open the SCSS calculator
    Then the SCSS investment amount should be 1000000
    And the SCSS tenure should be 5 years
    And the SCSS senior age should be 65
    And the SCSS interest rate should match the current SCSS rate
    And the SCSS results panel should be visible

  @smoke @calculator-scss
  Scenario: SCSS-02 Results update in real time without Calculate button
    Given I open the SCSS calculator
    When I set SCSS investment amount to 500000
    Then the SCSS maturity amount should update without clicking calculate

  @smoke @tax @calculator-scss
  Scenario: SCSS-03 Results panel shows Money in Hand (post-tax)
    Given I open the SCSS calculator
    When I enter SCSS inputs from golden "SCSS-03"
    Then the SCSS money in hand should match golden "SCSS-03" within tolerance

  @tax @calculator-scss
  Scenario: SCSS-04 Tax breakdown visible with rule explanation
    Given I open the SCSS calculator
    When I enter SCSS inputs from golden "SCSS-03"
    Then I should see the SCSS tax breakdown section
    And the SCSS tax rule should mention interest taxed per income slab

  @tax @calculator-scss
  Scenario: SCSS-05 Inflation toggle affects spending power when ON
    Given I open the SCSS calculator
    And inflation adjustment is on
    When I enter SCSS inputs from golden "SCSS-14"
    Then the SCSS spending power should be less than money in hand

  @smoke @calculator-scss
  Scenario: SCSS-06 Evolution table shows year-wise breakdown
    Given I open the SCSS calculator
    Then the SCSS evolution table should show 5 year rows

  @smoke @calculator-scss
  Scenario: SCSS-07 Info panel shows current rate and last updated
    Given I open the SCSS calculator
    Then the SCSS info panel should show current SCSS interest rate
    And the SCSS info panel should show last updated date

  @edge @calculator-scss
  Scenario: SCSS-08 Invalid min amount shows inline validation error
    Given I open the SCSS calculator
    When I set SCSS investment amount to 999
    Then I should see SCSS validation error containing "Minimum investment amount is"

  @edge @calculator-scss
  Scenario: SCSS-09 Invalid max amount shows inline validation error
    Given I open the SCSS calculator
    When I set SCSS investment amount to 3000001
    Then I should see SCSS validation error containing "Maximum investment amount is"

  @edge @calculator-scss
  Scenario: SCSS-10 Zero or empty input does not crash
    Given I open the SCSS calculator
    When I clear SCSS investment amount
    Then the SCSS calculator should not crash
    And the SCSS results panel should show empty state or validation

  @edge @calculator-scss
  Scenario: SCSS-11 Negative input rejected or clamped
    Given I open the SCSS calculator
    When I set SCSS investment amount to -1000
    Then I should see an SCSS validation error or clamped minimum value

  @edge @calculator-scss
  Scenario: SCSS-12 Non-numeric input rejected
    Given I open the SCSS calculator
    When I enter non-numeric SCSS investment amount "abc"
    Then I should see an SCSS validation error or unchanged numeric value

  @edge @calculator-scss
  Scenario: SCSS-13 Extremely large value handled without overflow
    Given I open the SCSS calculator
    When I set SCSS investment amount to 3000000
    Then the SCSS results panel should display a maturity amount

  @regression @tax @calculator-scss
  Scenario Outline: SCSS-14 Golden calculation matches reference value
    Given I open the SCSS calculator
    When I enter SCSS inputs from golden "<goldenId>"
    Then the SCSS maturity amount should match golden "<goldenId>" within tolerance
    And the SCSS quarterly interest should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId     |
      | SCSS-14      |
      | SCSS-14-max  |

  @edge @calculator-scss
  Scenario: SCSS-15 Pie chart renders investment breakdown
    Given I open the SCSS calculator
    Then the SCSS pie chart should render or show graceful fallback

  @edge @calculator-scss
  Scenario: SCSS-20 Age 60+ validation for senior eligibility
    Given I open the SCSS calculator
    When I set SCSS senior age to 59
    Then I should see SCSS validation error containing "Minimum age is 60 years"
    When I set SCSS senior age to 60
    Then I should not see SCSS validation error for minimum age

  @edge @calculator-scss
  Scenario: SCSS-21 Maximum principal capped at 30 lakh
    Given I open the SCSS calculator
    When I set SCSS investment amount to 3000000
    Then I should not see SCSS validation error for maximum investment
    When I set SCSS investment amount to 3000001
    Then I should see SCSS validation error containing "Maximum investment amount is"

  @regression @calculator-scss
  Scenario: SCSS-22 Quarterly interest payout displayed in results
    Given I open the SCSS calculator
    When I enter SCSS inputs from golden "SCSS-22"
    Then the SCSS quarterly interest should match golden "SCSS-22" within tolerance
    And the SCSS info panel should mention quarterly interest

  @tax @regression @calculator-scss
  Scenario: SCSS-23 TDS on interest above threshold
    Given I open the SCSS calculator
    When I enter SCSS inputs from golden "SCSS-23"
    Then I should see SCSS TDS information in tax breakdown
    And the SCSS annual interest should exceed 40000

  @wip @calculator-scss
  Scenario: SCSS-25 Premature closure not yet implemented
    Given I open the SCSS calculator
    When I request SCSS premature closure calculation
    Then the SCSS premature closure feature should be marked not implemented
