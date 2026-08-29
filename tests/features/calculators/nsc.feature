@smoke @regression @tax @calculator-nsc
Feature: NSC Calculator
  National Savings Certificate calculator with fixed 5-year tenure,
  Section 80C deduction, and interest paid at maturity.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-nsc
  Scenario: NSC-01 Calculator loads with documented default values
    Given I open the NSC calculator
    Then the NSC investment amount should be 100000
    And the NSC tenure should be fixed at 5 years
    And the NSC interest rate should match the current NSC rate
    And the NSC results panel should be visible

  @smoke @calculator-nsc
  Scenario: NSC-02 Results update in real time without Calculate button
    Given I open the NSC calculator
    When I set NSC investment amount to 500000
    Then the NSC maturity amount should update without clicking calculate

  @smoke @tax @calculator-nsc
  Scenario: NSC-03 Results panel shows Money in Hand (post-tax)
    Given I open the NSC calculator
    When I enter NSC inputs from golden "NSC-03"
    Then the NSC money in hand should match golden "NSC-03" within tolerance

  @tax @calculator-nsc
  Scenario: NSC-04 Tax breakdown visible with rule explanation
    Given I open the NSC calculator
    When I enter NSC inputs from golden "NSC-03"
    Then I should see the NSC tax breakdown section
    And the NSC tax rule should mention interest taxed per income slab

  @tax @calculator-nsc
  Scenario: NSC-05 Inflation toggle affects spending power when ON
    Given I open the NSC calculator
    And inflation adjustment is on
    When I enter NSC inputs from golden "NSC-14"
    Then the NSC spending power should be less than money in hand

  @smoke @calculator-nsc
  Scenario: NSC-06 Evolution table shows year-wise breakdown
    Given I open the NSC calculator
    Then the NSC evolution table should show 5 year rows

  @smoke @calculator-nsc
  Scenario: NSC-07 Info panel shows current rate and last updated
    Given I open the NSC calculator
    Then the NSC info panel should show current NSC interest rate
    And the NSC info panel should show last updated date

  @edge @calculator-nsc
  Scenario: NSC-08 Invalid min amount shows inline validation error
    Given I open the NSC calculator
    When I set NSC investment amount to 999
    Then I should see NSC validation error containing "Minimum investment amount is"

  @edge @calculator-nsc
  Scenario: NSC-09 Invalid max amount shows inline validation error
    Given I open the NSC calculator
    When I set NSC investment amount to 10000001
    Then I should see an NSC amount validation error or capped results

  @edge @calculator-nsc
  Scenario: NSC-10 Zero or empty input does not crash
    Given I open the NSC calculator
    When I clear NSC investment amount
    Then the NSC calculator should not crash
    And the NSC results panel should show empty state or validation

  @edge @calculator-nsc
  Scenario: NSC-11 Negative input rejected or clamped
    Given I open the NSC calculator
    When I set NSC investment amount to -1000
    Then I should see an NSC validation error or clamped minimum value

  @edge @calculator-nsc
  Scenario: NSC-12 Non-numeric input rejected
    Given I open the NSC calculator
    When I enter non-numeric NSC investment amount "abc"
    Then I should see an NSC validation error or unchanged numeric value

  @edge @calculator-nsc
  Scenario: NSC-13 Extremely large value handled without overflow
    Given I open the NSC calculator
    When I set NSC investment amount to 10000000
    Then the NSC results panel should display a maturity amount

  @regression @tax @calculator-nsc
  Scenario Outline: NSC-14 Golden calculation matches reference value
    Given I open the NSC calculator
    When I enter NSC inputs from golden "<goldenId>"
    Then the NSC maturity amount should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId |
      | NSC-14   |

  @edge @calculator-nsc
  Scenario: NSC-15 Pie chart renders investment breakdown
    Given I open the NSC calculator
    Then the NSC pie chart should render or show graceful fallback

  @edge @calculator-nsc
  Scenario: NSC-20 Fixed 5-year tenure is locked
    Given I open the NSC calculator
    Then the NSC tenure should be fixed at 5 years
    And the NSC info panel should mention 5 year lock-in

  @tax @calculator-nsc
  Scenario: NSC-21 Section 80C deduction noted in info panel
    Given I open the NSC calculator
    Then the NSC info panel should mention Section 80C deduction

  @tax @regression @calculator-nsc
  Scenario: NSC-22 Interest taxable and paid at maturity
    Given I open the NSC calculator
    When I enter NSC inputs from golden "NSC-22"
    Then the NSC interest earned should match golden "NSC-22" within tolerance
    And the NSC tax deducted should match golden "NSC-22" within tolerance
    And the NSC info panel should mention interest paid at maturity

  @wip @calculator-nsc
  Scenario: NSC-25 Premature encashment not yet implemented
    Given I open the NSC calculator
    When I request NSC premature encashment calculation
    Then the NSC premature encashment feature should be marked not implemented
