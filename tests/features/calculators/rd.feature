@calculator-rd
Feature: Recurring Deposit Calculator
  As an investor
  I want to calculate RD maturity with flexible tenure and compounding
  So that I can plan post-tax returns on monthly deposits

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off
    Given I am on the RD calculator page

  @smoke @calculator-rd
  Scenario: RD-01 Calculator loads with documented default values
    Then the monthly deposit amount should be 5000
    And the tenure years should be 1
    And the tenure months should be 0
    And the interest rate should match the documented RD rate
    And the compounding frequency should be "quarterly"

  @smoke @calculator-rd
  Scenario: RD-02 Results update in real time without Calculate button
    When I set the RD monthly deposit to 10000
    And I set the RD tenure to 3 years and 0 months
    Then the RD results panel should display a maturity amount

  @smoke @tax @calculator-rd
  Scenario: RD-03 Results panel shows Money in Hand post-tax
    When I apply golden fixture "RD-03" to the RD calculator
    Then the RD money in hand should be approximately 341764.77 within 50

  @tax @calculator-rd
  Scenario: RD-04 Tax breakdown visible with rule explanation
    When I apply golden fixture "RD-03" to the RD calculator
    Then I should see the RD tax breakdown section
    And the RD tax rule should mention interest taxed per income slab

  @tax @calculator-rd
  Scenario: RD-05 Inflation toggle affects spending power when ON
    Given inflation adjustment is on
    When I apply golden fixture "RD-14" to the RD calculator
    Then I should see the RD spending power section
    And the RD spending power should be less than money in hand

  @smoke @calculator-rd
  Scenario: RD-06 Evolution table shows year-wise breakdown
    When I apply golden fixture "RD-14" to the RD calculator
    Then the RD evolution table should have 5 year rows

  @smoke @calculator-rd
  Scenario: RD-07 Info panel shows current rate and last updated
    Then the RD info panel should show the current RD rate
    And the RD info panel should show a last updated date

  @edge @calculator-rd
  Scenario: RD-08 Invalid min amount shows inline validation error
    When I set the RD monthly deposit to 499
    Then I should see RD validation error "Minimum monthly deposit is ₹500"

  @edge @calculator-rd
  Scenario: RD-09 Invalid max tenure shows inline validation error
    When I set the RD tenure to 11 years and 0 months
    Then I should see RD validation error "Maximum tenure is 10 years"

  @edge @calculator-rd
  Scenario: RD-10 Zero tenure does not crash and shows error
    When I set the RD tenure to 0 years and 0 months
    Then I should see RD validation error "Please enter at least 1 month"

  @edge @calculator-rd
  Scenario: RD-11 Negative monthly deposit rejected
    When I set the RD monthly deposit to -1000
    Then I should see an RD deposit validation error

  @edge @calculator-rd
  Scenario: RD-12 Non-numeric monthly deposit rejected
    When I enter non-numeric text in the RD monthly deposit field
    Then I should see an RD deposit validation error

  @edge @calculator-rd
  Scenario: RD-13 Extremely large monthly deposit handled without overflow
    When I set the RD monthly deposit to 100000
    And I set the RD tenure to 5 years and 0 months
    And I set the RD rate to 7
    Then the RD results panel should display a maturity amount

  @regression @tax @calculator-rd
  Scenario Outline: RD-14 Golden calculation matches reference value
    When I set the RD monthly deposit to <monthlyDeposit>
    And I set the RD tenure to <tenureYears> years and <tenureMonths> months
    And I set the RD rate to <rate>
    And I set the RD compounding to "<compoundingFrequency>"
    Then the RD maturity amount should be approximately <maturityAmount> within <tolerance>

    Examples:
      | monthlyDeposit | tenureYears | tenureMonths | rate | compoundingFrequency | maturityAmount | tolerance |
      | 5000           | 5           | 0            | 7    | quarterly            | 359663.95      | 50        |

  @edge @calculator-rd
  Scenario: RD-15 Pie chart renders or graceful fallback
    When I apply golden fixture "RD-14" to the RD calculator
    Then the RD investment breakdown chart should be visible or gracefully hidden

  @regression @calculator-rd
  Scenario: RD-20 Monthly deposit minimum ₹500 calculated correctly
    When I set the RD monthly deposit to 500
    And I set the RD tenure to 1 years and 0 months
    And I set the RD rate to 6.5
    And I set the RD compounding to "quarterly"
    Then the RD maturity amount should be approximately 6214.32 within 10

  @regression @calculator-rd
  Scenario: RD-21 Years and months tenure calculated correctly
    When I set the RD monthly deposit to 5000
    And I set the RD tenure to 1 years and 3 months
    And I set the RD rate to 6.5
    And I set the RD compounding to "quarterly"
    Then the RD maturity amount should be approximately 78315.27 within 50

  @tax @regression @calculator-rd
  Scenario: RD-22 Interest taxable per income slab
    When I apply golden fixture "RD-22" to the RD calculator
    Then the RD money in hand should be approximately 341764.77 within 50
    And the RD tax rule should mention interest taxed per income slab

  @wip @tax @calculator-rd
  Scenario: RD-23 TDS warning when annual interest exceeds threshold
    When I apply golden fixture "RD-14" to the RD calculator
    Then I should see RD TDS applicable warning
    And the RD annual interest should exceed 40000

  @wip @tax @calculator-rd
  Scenario: RD-24 Senior citizen TDS threshold 50000
    Given the RD investor is a senior citizen
    When I apply golden fixture "RD-14" to the RD calculator
    Then the RD TDS threshold should be 50000

  @wip @calculator-rd
  Scenario: RD-25 Premature withdrawal
    When I request RD premature withdrawal calculation
    Then the RD premature withdrawal feature should be marked not implemented
