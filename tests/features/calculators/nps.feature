@smoke @regression @tax @calculator-nps
Feature: NPS Calculator
  National Pension System calculator with asset allocation,
  weighted return, and 60% tax-free / 40% taxable withdrawal.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-nps
  Scenario: NPS-01 Calculator loads with documented default values
    Given I open the NPS calculator
    Then the NPS monthly contribution should be 5000
    And the NPS investment tenure should be 25 years
    And the NPS current age should be 35
    And the NPS total allocation should be 100 percent
    And the NPS results panel should be visible

  @smoke @calculator-nps
  Scenario: NPS-02 Results update in real time without Calculate button
    Given I open the NPS calculator
    When I set NPS monthly contribution to 10000
    Then the NPS corpus value should update without clicking calculate

  @smoke @tax @calculator-nps
  Scenario: NPS-03 Results panel shows Money in Hand post-tax
    Given I open the NPS calculator
    When I enter NPS inputs from golden "NPS-03"
    Then the NPS money in hand should match golden "NPS-03" within tolerance

  @tax @calculator-nps
  Scenario: NPS-04 Tax breakdown visible with rule explanation
    Given I open the NPS calculator
    When I enter NPS inputs from golden "NPS-03"
    Then I should see the NPS tax breakdown section
    And the NPS tax rule should mention 60 percent tax-free and 40 percent taxable

  @tax @calculator-nps
  Scenario: NPS-05 Inflation toggle affects spending power when ON
    Given I open the NPS calculator
    And inflation adjustment is on
    When I enter NPS inputs from golden "NPS-14"
    Then the NPS spending power should be less than money in hand

  @smoke @calculator-nps
  Scenario: NPS-06 Evolution table shows year-wise breakdown
    Given I open the NPS calculator
    Then the NPS evolution table should show 25 year rows

  @smoke @calculator-nps
  Scenario: NPS-07 Info panel shows allocation rules and last updated
    Given I open the NPS calculator
    Then the NPS info panel should show weighted return formula
    And the NPS info panel should show last updated date

  @edge @calculator-nps
  Scenario: NPS-08 Invalid min contribution shows inline validation error
    Given I open the NPS calculator
    When I set NPS monthly contribution to 499
    Then I should see NPS validation error containing "Minimum contribution is"

  @edge @calculator-nps
  Scenario: NPS-09 Invalid allocation not summing to 100 percent shows error
    Given I open the NPS calculator
    When I set NPS equity allocation to 50
    And I set NPS corporate bonds allocation to 30
    And I set NPS government bonds allocation to 15
    Then I should see NPS allocation must equal 100 percent error

  @edge @calculator-nps
  Scenario: NPS-10 Zero or empty contribution does not crash
    Given I open the NPS calculator
    When I clear NPS monthly contribution
    Then the NPS calculator should not crash
    And the NPS results panel should show empty state or validation

  @edge @calculator-nps
  Scenario: NPS-11 Negative contribution rejected or clamped
    Given I open the NPS calculator
    When I set NPS monthly contribution to -1000
    Then I should see an NPS validation error or clamped minimum value

  @edge @calculator-nps
  Scenario: NPS-12 Non-numeric contribution rejected
    Given I open the NPS calculator
    When I enter non-numeric NPS monthly contribution "abc"
    Then I should see an NPS validation error or unchanged numeric value

  @edge @calculator-nps
  Scenario: NPS-13 Extremely large contribution handled without overflow
    Given I open the NPS calculator
    When I enter NPS inputs from golden "NPS-13"
    Then the NPS results panel should display a corpus amount

  @regression @tax @calculator-nps
  Scenario Outline: NPS-14 Golden calculation matches reference value
    Given I open the NPS calculator
    When I enter NPS inputs from golden "<goldenId>"
    Then the NPS corpus value should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId |
      | NPS-14   |

  @edge @calculator-nps
  Scenario: NPS-15 Pie chart renders investment breakdown
    Given I open the NPS calculator
    Then the NPS pie chart should render or show graceful fallback

  @edge @calculator-nps
  Scenario: NPS-20 Asset allocation must sum to 100 percent
    Given I open the NPS calculator
    When I enter NPS inputs from golden "NPS-20"
    Then the NPS total allocation should be 100 percent
    And the NPS corpus value should match golden "NPS-20" within tolerance

  @regression @calculator-nps
  Scenario: NPS-21 Weighted return reflects asset allocation
    Given I open the NPS calculator
    When I enter NPS inputs from golden "NPS-21"
    Then the NPS corpus value should match golden "NPS-21" within tolerance

  @tax @regression @calculator-nps
  Scenario: NPS-22 60 percent tax-free and 40 percent taxable on withdrawal
    Given I open the NPS calculator
    When I enter NPS inputs from golden "NPS-22"
    Then the NPS tax deducted should match golden "NPS-22" within tolerance
    And the NPS money in hand should match golden "NPS-22" within tolerance
    And the NPS tax rule should mention 60 percent tax-free and 40 percent taxable

  @wip @calculator-nps
  Scenario: NPS-23 Tier 2 account not yet implemented
    Given I open the NPS calculator
    When I request NPS Tier 2 calculation
    Then the NPS Tier 2 feature should be marked not implemented

  @edge @calculator-nps
  Scenario: NPS-24 Negative return edge case does not produce NaN
    Given I open the NPS calculator
    When I enter NPS inputs from golden "NPS-24"
    Then the NPS corpus value should match golden "NPS-24" within tolerance
    And the NPS calculator should not crash
