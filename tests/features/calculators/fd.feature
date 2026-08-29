@calculator-fd
Feature: Fixed Deposit Calculator
  As an investor
  I want to calculate FD maturity with flexible tenure and compounding
  So that I can plan post-tax returns

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off
    Given I am on the FD calculator page

  @smoke @calculator-fd
  Scenario: FD-01 Calculator loads with documented default values
    Then the principal amount should be 100000
    And the tenure years should be 1
    And the tenure months should be 0
    And the interest rate should match the documented FD rate
    And the compounding frequency should be "quarterly"

  @smoke @calculator-fd
  Scenario: FD-02 Results update in real time without Calculate button
    When I set the FD principal to 500000
    And I set the FD tenure to 3 years and 0 months
    Then the FD results panel should display a maturity amount

  @smoke @tax @calculator-fd
  Scenario: FD-03 Results panel shows Money in Hand post-tax
    When I apply golden fixture "FD-03" to the FD calculator
    Then the FD money in hand should be approximately 129034 within 50

  @tax @calculator-fd
  Scenario: FD-04 Tax breakdown visible with rule explanation
    When I apply golden fixture "FD-03" to the FD calculator
    Then I should see the FD tax breakdown section
    And the FD tax rule should mention interest taxed per income slab

  @tax @calculator-fd
  Scenario: FD-05 Inflation toggle affects spending power when ON
    Given inflation adjustment is on
    When I apply golden fixture "FD-14" to the FD calculator
    Then I should see the FD spending power section
    And the FD spending power should be less than money in hand

  @smoke @calculator-fd
  Scenario: FD-06 Evolution table shows year-wise breakdown
    When I apply golden fixture "FD-14" to the FD calculator
    Then the FD evolution table should have 5 year rows

  @smoke @calculator-fd
  Scenario: FD-07 Info panel shows current rate and last updated
    Then the FD info panel should show the current FD rate
    And the FD info panel should show a last updated date

  @edge @calculator-fd
  Scenario: FD-08 Invalid min amount shows inline validation error
    When I set the FD principal to 999
    Then I should see FD validation error "Minimum principal amount is ₹1,000"

  @edge @calculator-fd
  Scenario: FD-09 Invalid max amount shows inline validation error
    When I set the FD principal to 10000001
    Then I should see an FD amount validation error

  @edge @calculator-fd
  Scenario: FD-10 Zero tenure does not crash and shows error
    When I set the FD tenure to 0 years and 0 months
    Then I should see FD validation error "Please enter at least 1 month"

  @edge @calculator-fd
  Scenario: FD-11 Negative principal rejected
    When I set the FD principal to -5000
    Then I should see an FD amount validation error

  @edge @calculator-fd
  Scenario: FD-12 Non-numeric principal rejected
    When I enter non-numeric text in the FD principal field
    Then I should see an FD principal validation error

  @edge @calculator-fd
  Scenario: FD-13 Extremely large principal handled without overflow
    When I set the FD principal to 10000000
    And I set the FD tenure to 10 years and 0 months
    Then the FD results panel should display a maturity amount

  @regression @tax @calculator-fd
  Scenario Outline: FD-14 Golden calculation matches reference value
    When I set the FD principal to <principal>
    And I set the FD tenure to <tenureYears> years and <tenureMonths> months
    And I set the FD rate to <rate>
    And I set the FD compounding to "<compoundingFrequency>"
    Then the FD maturity amount should be approximately <maturityAmount> within <tolerance>

    Examples:
      | principal | tenureYears | tenureMonths | rate | compoundingFrequency | maturityAmount | tolerance |
      | 100000    | 5           | 0            | 7    | quarterly            | 141477.82      | 50        |

  @edge @calculator-fd
  Scenario: FD-15 Pie chart renders or graceful fallback
    When I apply golden fixture "FD-14" to the FD calculator
    Then the FD investment breakdown chart should be visible or gracefully hidden

  @regression @calculator-fd
  Scenario: FD-20 Years and months tenure calculated correctly
    When I set the FD principal to 100000
    And I set the FD tenure to 1 years and 3 months
    And I set the FD rate to 6.5
    And I set the FD compounding to "quarterly"
    Then the FD maturity amount should be approximately 108393.39 within 50

  @regression @calculator-fd
  Scenario: FD-21 Legacy tenure format still works
    Given FD instrument data with legacy tenure 24 months
    When the FD tenure is migrated to years and months
    Then the FD tenure should be 2 years and 0 months
    And the FD maturity amount should be approximately 113763.9 within 50

  @regression @calculator-fd
  Scenario Outline: FD-22 Compounding frequency affects maturity amount
    When I set the FD principal to 100000
    And I set the FD tenure to 5 years and 0 months
    And I set the FD rate to 7
    And I set the FD compounding to "<compoundingFrequency>"
    Then the FD maturity amount should be approximately <maturityAmount> within 50

    Examples:
      | compoundingFrequency | maturityAmount |
      | quarterly            | 141477.82      |
      | monthly              | 141762.53      |
      | annually             | 140255.17      |
      | cumulative           | 140255.17      |

  @tax @regression @calculator-fd
  Scenario: FD-23 TDS warning when annual interest exceeds threshold
    When I apply golden fixture "FD-23" to the FD calculator
    Then I should see FD TDS applicable warning
    And the FD annual interest should exceed 40000

  @wip @tax @calculator-fd
  Scenario: FD-24 Senior citizen TDS threshold 50000
    Given the FD investor is a senior citizen
    When I apply golden fixture "FD-23" to the FD calculator
    Then the FD TDS threshold should be 50000

  @wip @calculator-fd
  Scenario: FD-25 Premature withdrawal
    When I request FD premature withdrawal calculation
    Then the FD premature withdrawal feature should be marked not implemented
