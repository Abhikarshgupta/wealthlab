@smoke @regression @tax @calculator-ssy
Feature: SSY Calculator
  Sukanya Samriddhi Yojana calculator for girl child savings with age < 10 validation,
  ₹1.5L annual cap, 21-year maturity, and EEE tax treatment.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-ssy
  Scenario: SSY-01 Calculator loads with documented default values
    Given I open the SSY calculator
    Then the SSY yearly investment should be 10000
    And the girl's age should be 5
    And the SSY interest rate should match the current SSY rate
    And the SSY results panel should be visible

  @smoke @calculator-ssy
  Scenario: SSY-02 Results update in real time without Calculate button
    Given I open the SSY calculator
    When I set SSY yearly investment to 50000
    Then the SSY maturity amount should update without clicking calculate

  @smoke @tax @calculator-ssy
  Scenario: SSY-03 Results panel shows Money in Hand (post-tax)
    Given I open the SSY calculator
    Then the SSY results panel should show money in hand

  @tax @calculator-ssy
  Scenario: SSY-04 Tax breakdown visible with rule explanation
    Given I open the SSY calculator
    Then the SSY info panel should explain EEE tax benefits
    And no SSY income tax should be deducted from maturity

  @tax @calculator-ssy
  Scenario: SSY-05 Inflation toggle affects spending power when ON
    Given I open the SSY calculator
    And inflation adjustment is on
    When I set SSY yearly investment to 100000
    Then the SSY spending power amount should be less than maturity value

  @smoke @calculator-ssy
  Scenario: SSY-06 Evolution table shows year-wise breakdown
    Given I open the SSY calculator
    Then the SSY evolution table should show 16 year rows

  @smoke @calculator-ssy
  Scenario: SSY-07 Info panel shows current rate and last updated
    Given I open the SSY calculator
    Then the SSY info panel should show current SSY interest rate
    And the SSY info panel should show last updated date

  @edge @calculator-ssy
  Scenario: SSY-08 Invalid min amount shows inline validation error
    Given I open the SSY calculator
    When I set SSY yearly investment to 249
    Then I should see SSY validation error containing "Minimum investment is"

  @edge @calculator-ssy
  Scenario: SSY-09 Invalid max amount shows inline validation error
    Given I open the SSY calculator
    When I set SSY yearly investment to 150001
    Then I should see SSY validation error containing "Maximum investment is"

  @edge @calculator-ssy
  Scenario: SSY-10 Zero or empty input does not crash
    Given I open the SSY calculator
    When I clear SSY yearly investment
    Then the SSY calculator should not crash
    And the SSY results panel should show empty state or validation

  @edge @calculator-ssy
  Scenario: SSY-11 Negative input rejected or clamped
    Given I open the SSY calculator
    When I set SSY yearly investment to -1000
    Then I should see SSY validation error or clamped minimum value

  @edge @calculator-ssy
  Scenario: SSY-12 Non-numeric input rejected
    Given I open the SSY calculator
    When I enter non-numeric SSY yearly investment "abc"
    Then I should see SSY validation error or unchanged numeric value

  @edge @calculator-ssy
  Scenario: SSY-13 Extremely large value handled without overflow
    Given I open the SSY calculator
    When I set SSY yearly investment to 999999999
    Then I should see SSY validation error containing "Maximum investment is"

  @regression @tax @calculator-ssy
  Scenario Outline: SSY-14 Golden calculation matches reference value
    Given I open the SSY calculator
    When I enter SSY inputs from golden "<goldenId>"
    Then the SSY maturity amount should match golden "<goldenId>" within tolerance
    And the SSY total invested should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId     |
      | SSY-14       |
      | SSY-14-max   |

  @edge @calculator-ssy
  Scenario: SSY-15 Pie chart renders investment breakdown
    Given I open the SSY calculator
    Then the SSY pie chart should render or show graceful fallback

  @edge @calculator-ssy
  Scenario: SSY-20 Girl child age below 10 validation
    Given I open the SSY calculator
    When I set girl's age to 9
    Then I should not see SSY validation error for girl's age
    When I set girl's age to 10
    Then I should see SSY validation error containing "below 10 years"

  @edge @calculator-ssy
  Scenario: SSY-21 Yearly investment capped at 1.5 lakh validation
    Given I open the SSY calculator
    When I set SSY yearly investment to 150000
    Then I should not see SSY validation error for maximum investment
    When I set SSY yearly investment to 150001
    Then I should see SSY validation error containing "Maximum investment is"

  @regression @calculator-ssy
  Scenario: SSY-22 Twenty-one year maturity from account opening for newborn
    Given I open the SSY calculator
    When I set girl's age to 0
    Then the SSY investment period should be 21 years
    And the SSY info panel should mention girl child turns 21
    When I set girl's age to 9
    Then the SSY investment period should be 12 years

  @tax @regression @calculator-ssy
  Scenario: SSY-23 Maturity is tax-free EEE post-tax equals nominal
    Given I open the SSY calculator
    When I enter SSY inputs from golden "SSY-23"
    Then the SSY money in hand amount should match golden "SSY-23" within tolerance
    And the SSY tax deducted should be zero
