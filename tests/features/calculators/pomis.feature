@smoke @regression @tax @calculator-pomis
Feature: POMIS Calculator
  Post Office Monthly Income Scheme calculator with fixed 5-year tenure,
  monthly interest payout, and single/joint investment limits.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-pomis
  Scenario: POMIS-01 Calculator loads with documented default values
    Given I open the POMIS calculator
    Then the POMIS investment amount should be 100000
    And the POMIS interest rate should match the current POMIS rate
    And the POMIS tenure should be fixed at 5 years
    And the POMIS results panel should be visible

  @smoke @calculator-pomis
  Scenario: POMIS-02 Results update in real time without Calculate button
    Given I open the POMIS calculator
    When I set POMIS investment amount to 500000
    Then the POMIS results panel should display money in hand

  @smoke @tax @calculator-pomis
  Scenario: POMIS-03 Results panel shows Money in Hand (post-tax)
    Given I open the POMIS calculator
    When I enter POMIS inputs from golden "POMIS-03"
    Then the POMIS money in hand should match golden "POMIS-03" within tolerance

  @tax @calculator-pomis
  Scenario: POMIS-04 Tax breakdown visible with rule explanation
    Given I open the POMIS calculator
    When I enter POMIS inputs from golden "POMIS-03"
    Then I should see the POMIS tax breakdown section
    And the POMIS tax rule should mention interest taxed per income slab

  @tax @calculator-pomis
  Scenario: POMIS-05 Inflation toggle affects spending power when ON
    Given inflation adjustment is on
    And I open the POMIS calculator
    When I enter POMIS inputs from golden "POMIS-14"
    Then the POMIS spending power should be less than money in hand

  @smoke @calculator-pomis
  Scenario: POMIS-06 Evolution table shows year-wise breakdown
    Given I open the POMIS calculator
    When I enter POMIS inputs from golden "POMIS-14"
    Then the POMIS evolution table should show 5 year rows

  @smoke @calculator-pomis
  Scenario: POMIS-07 Info panel shows current rate and last updated
    Given I open the POMIS calculator
    Then the POMIS info panel should show current POMIS interest rate
    And the POMIS info panel should show last updated date

  @edge @calculator-pomis
  Scenario: POMIS-08 Invalid min amount shows inline validation error
    Given I open the POMIS calculator
    When I set POMIS investment amount to 999
    Then I should see POMIS validation error containing "Minimum investment amount is"

  @edge @calculator-pomis
  Scenario: POMIS-09 Invalid max amount for single account shows error or empty state
    Given I open the POMIS calculator
    When I set POMIS investment amount to 1000000
    Then I should see a POMIS amount validation error or empty results for single account

  @edge @calculator-pomis
  Scenario: POMIS-10 Zero or empty input does not crash
    Given I open the POMIS calculator
    When I clear POMIS investment amount
    Then the POMIS calculator should not crash
    And the POMIS results panel should show empty state or validation

  @edge @calculator-pomis
  Scenario: POMIS-11 Negative input rejected or clamped
    Given I open the POMIS calculator
    When I set POMIS investment amount to -1000
    Then I should see a POMIS validation error or clamped minimum value

  @edge @calculator-pomis
  Scenario: POMIS-12 Non-numeric input rejected
    Given I open the POMIS calculator
    When I enter non-numeric POMIS investment amount "abc"
    Then I should see a POMIS validation error or unchanged numeric value

  @edge @calculator-pomis
  Scenario: POMIS-13 Extremely large joint investment handled without overflow
    Given I open the POMIS calculator
    When POMIS joint account is enabled
    When I set POMIS investment amount to 1500000
    Then the POMIS results panel should display money in hand

  @regression @tax @calculator-pomis
  Scenario Outline: POMIS-14 Golden calculation matches reference value
    Given I open the POMIS calculator
    When I enter POMIS inputs from golden "<goldenId>"
    Then the POMIS maturity amount should match golden "<goldenId>" within tolerance
    And the POMIS monthly interest should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId  |
      | POMIS-14  |

  @edge @calculator-pomis
  Scenario: POMIS-15 Pie chart renders investment breakdown
    Given I open the POMIS calculator
    Then the POMIS pie chart should render or show graceful fallback

  @regression @calculator-pomis
  Scenario: POMIS-20 Fixed 5-year tenure is locked
    Given I open the POMIS calculator
    Then the POMIS tenure should be fixed at 5 years
    And the POMIS info panel should mention 5 year lock-in

  @regression @calculator-pomis
  Scenario: POMIS-21 Monthly interest payout displayed prominently
    Given I open the POMIS calculator
    When I enter POMIS inputs from golden "POMIS-21"
    Then the POMIS monthly income payment should match golden "POMIS-21" within tolerance

  @edge @calculator-pomis
  Scenario: POMIS-22 Max investment limit enforced by account type
    Given I open the POMIS calculator
    When I enter POMIS inputs from golden "POMIS-22-SINGLE"
    Then the POMIS maturity amount should match golden "POMIS-22-SINGLE" within tolerance
    When POMIS joint account is enabled
    When I enter POMIS inputs from golden "POMIS-22-JOINT"
    Then the POMIS maturity amount should match golden "POMIS-22-JOINT" within tolerance

  @tax @regression @calculator-pomis
  Scenario: POMIS-TDS TDS warning when annual interest exceeds threshold
    Given I open the POMIS calculator
    When I enter POMIS inputs from golden "POMIS-TDS"
    Then I should see POMIS TDS applicable warning
    And the POMIS annual interest should exceed 40000
