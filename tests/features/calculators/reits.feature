@smoke @regression @tax @calculator-reits
Feature: REITs Calculator
  Real Estate Investment Trust calculator with dividend income,
  capital appreciation, and LTCG/STCG tax on withdrawal.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-reits
  Scenario: REIT-01 Calculator loads with documented default values
    Given I open the REITs calculator
    Then the REIT investment amount should be 100000
    And the REIT dividend yield should match the current REIT rate
    And the REIT capital appreciation should match the current REIT rate
    And the REIT tenure should be 5 years
    And the REIT results panel should be visible

  @smoke @calculator-reits
  Scenario: REIT-02 Results update in real time without Calculate button
    Given I open the REITs calculator
    When I set REIT investment amount to 200000
    Then the REIT money in hand should update without clicking calculate

  @smoke @tax @calculator-reits
  Scenario: REIT-03 Results panel shows Money in Hand (post-tax)
    Given I open the REITs calculator
    When I enter REIT inputs from golden "REIT-03"
    Then the REIT money in hand should match golden "REIT-03" within tolerance

  @tax @calculator-reits
  Scenario: REIT-04 Tax breakdown visible with rule explanation
    Given I open the REITs calculator
    When I enter REIT inputs from golden "REIT-03"
    Then I should see the REIT tax breakdown section
    And the REIT tax rule should mention LTCG exemption

  @tax @calculator-reits
  Scenario: REIT-05 Inflation toggle affects spending power when ON
    Given I open the REITs calculator
    And inflation adjustment is on
    When I enter REIT inputs from golden "REIT-14"
    Then the REIT spending power should be less than money in hand

  @smoke @calculator-reits
  Scenario: REIT-06 Evolution table shows year-wise breakdown
    Given I open the REITs calculator
    Then the REIT evolution table should show 5 year rows

  @smoke @calculator-reits
  Scenario: REIT-07 Info panel shows expected return rates
    Given I open the REITs calculator
    Then the REIT info panel should show dividend yield rate
    And the REIT info panel should show capital appreciation rate

  @edge @calculator-reits
  Scenario: REIT-08 Invalid min amount shows inline validation error
    Given I open the REITs calculator
    When I set REIT investment amount to 999
    Then I should see REIT validation error containing "Minimum investment amount is"

  @edge @calculator-reits
  Scenario: REIT-09 Invalid max tenure shows inline validation error
    Given I open the REITs calculator
    When I set REIT tenure to 51 years
    Then I should see REIT validation error containing "Maximum tenure is 50 years"

  @edge @calculator-reits
  Scenario: REIT-10 Zero or empty input does not crash
    Given I open the REITs calculator
    When I clear REIT investment amount
    Then the REIT calculator should not crash
    And the REIT results panel should show empty state or validation

  @edge @calculator-reits
  Scenario: REIT-11 Negative input rejected or clamped
    Given I open the REITs calculator
    When I set REIT investment amount to -1000
    Then I should see a REIT validation error or clamped minimum value

  @edge @calculator-reits
  Scenario: REIT-12 Non-numeric input rejected
    Given I open the REITs calculator
    When I enter non-numeric REIT investment amount "abc"
    Then I should see a REIT validation error or unchanged numeric value

  @edge @calculator-reits
  Scenario: REIT-13 Extremely large investment handled without overflow
    Given I open the REITs calculator
    When I enter REIT inputs from golden "REIT-13"
    Then the REIT results panel should display money in hand

  @regression @tax @calculator-reits
  Scenario Outline: REIT-14 Golden calculation matches reference value
    Given I open the REITs calculator
    When I enter REIT inputs from golden "<goldenId>"
    Then the REIT final value should match golden "<goldenId>" within tolerance
    And the REIT money in hand should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId  |
      | REIT-14   |
      | REIT-03   |

  @edge @calculator-reits
  Scenario: REIT-15 Pie chart renders investment breakdown
    Given I open the REITs calculator
    Then the REIT pie chart should render or show graceful fallback

  @regression @calculator-reits
  Scenario: REIT-20 Dividend income and capital appreciation tracked separately
    Given I open the REITs calculator
    When I enter REIT inputs from golden "REIT-20"
    Then the REIT investment breakdown should show dividend and capital gain segments
    And the REIT final value should match golden "REIT-20" within tolerance

  @tax @regression @calculator-reits
  Scenario: REIT-21 LTCG tax above exemption for long holding period
    Given I open the REITs calculator
    When I enter REIT inputs from golden "REIT-21-LTCG"
    Then the REIT tax rate label should be "12.5% LTCG"
    And the REIT tax amount should match golden "REIT-21-LTCG" within tolerance

  @wip @tax @calculator-reits
  Scenario: REIT-21 STCG when tenure less than 1 year in UI
    # UI tenure min 1 year; STCG covered in unit tests via REIT-21-STCG
    Given REIT sub-year tenure is supported in UI
    When I set REIT tenure to 0 years
    Then the REIT tax rate label should be "20% STCG"
