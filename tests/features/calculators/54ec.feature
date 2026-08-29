@smoke @regression @tax @calculator-54ec
Feature: 54EC Bonds Calculator
  Capital Gain Bonds calculator with fixed 5-year lock-in,
  capital gains exemption on qualifying reinvestment, and taxable interest.

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off

  @smoke @calculator-54ec
  Scenario: 54EC-01 Calculator loads with documented default values
    Given I open the 54EC Bonds calculator
    Then the 54EC capital gain amount should be 1000000
    And the 54EC investment amount should be 1000000
    And the 54EC tenure should be fixed at 5 years
    And the 54EC interest rate should match the current 54EC rate
    And the 54EC results panel should be visible

  @smoke @calculator-54ec
  Scenario: 54EC-02 Results update in real time without Calculate button
    Given I open the 54EC Bonds calculator
    When I set 54EC investment amount to 500000
    Then the 54EC money in hand should update without clicking calculate

  @smoke @tax @calculator-54ec
  Scenario: 54EC-03 Results panel shows Money in Hand (post-tax)
    Given I open the 54EC Bonds calculator
    When I enter 54EC inputs from golden "54EC-03"
    Then the 54EC money in hand should match golden "54EC-03" within tolerance

  @tax @calculator-54ec
  Scenario: 54EC-04 Tax breakdown visible with rule explanation
    Given I open the 54EC Bonds calculator
    When I enter 54EC inputs from golden "54EC-03"
    Then I should see the 54EC tax breakdown section
    And the 54EC tax rule should mention interest taxable per income slab

  @tax @calculator-54ec
  Scenario: 54EC-05 Inflation toggle affects spending power when ON
    Given I open the 54EC Bonds calculator
    And inflation adjustment is on
    When I enter 54EC inputs from golden "54EC-14"
    Then the 54EC spending power should be less than money in hand

  @smoke @calculator-54ec
  Scenario: 54EC-06 Evolution table shows year-wise breakdown
    Given I open the 54EC Bonds calculator
    Then the 54EC evolution table should show 5 year rows

  @smoke @calculator-54ec
  Scenario: 54EC-07 Info panel shows current rate and last updated
    Given I open the 54EC Bonds calculator
    Then the 54EC info panel should show current 54EC interest rate
    And the 54EC info panel should show last updated date

  @edge @calculator-54ec
  Scenario: 54EC-08 Invalid min amount shows inline validation error
    Given I open the 54EC Bonds calculator
    When I set 54EC investment amount to 999
    Then I should see 54EC validation error containing "Minimum investment amount is"

  @edge @calculator-54ec
  Scenario: 54EC-09 Investment exceeding capital gain is clamped to capital gain
    Given I open the 54EC Bonds calculator
    When I set 54EC capital gain amount to 500000
    And I set 54EC investment amount to 600000
    Then the 54EC investment amount should be 500000

  @edge @calculator-54ec
  Scenario: 54EC-10 Zero or empty input does not crash
    Given I open the 54EC Bonds calculator
    When I clear 54EC investment amount
    Then the 54EC calculator should not crash
    And the 54EC results panel should show empty state or validation

  @edge @calculator-54ec
  Scenario: 54EC-11 Negative input rejected or clamped
    Given I open the 54EC Bonds calculator
    When I set 54EC investment amount to -1000
    Then I should see an 54EC validation error or clamped minimum value

  @edge @calculator-54ec
  Scenario: 54EC-12 Non-numeric input rejected
    Given I open the 54EC Bonds calculator
    When I enter non-numeric 54EC investment amount "abc"
    Then I should see an 54EC validation error or unchanged numeric value

  @edge @calculator-54ec
  Scenario: 54EC-13 Extremely large capital gain handled without overflow
    Given I open the 54EC Bonds calculator
    When I set 54EC capital gain amount to 10000000
    And I set 54EC investment amount to 5000000
    Then the 54EC results panel should display money in hand

  @regression @tax @calculator-54ec
  Scenario Outline: 54EC-14 Golden calculation matches reference value
    Given I open the 54EC Bonds calculator
    When I enter 54EC inputs from golden "<goldenId>"
    Then the 54EC maturity amount should match golden "<goldenId>" within tolerance
    And the 54EC tax saved should match golden "<goldenId>" within tolerance

    Examples:
      | goldenId |
      | 54EC-14  |

  @edge @calculator-54ec
  Scenario: 54EC-15 Pie chart renders investment breakdown
    Given I open the 54EC Bonds calculator
    Then the 54EC pie chart should render or show graceful fallback

  @edge @calculator-54ec
  Scenario: 54EC-20 Fixed 5-year lock-in is displayed
    Given I open the 54EC Bonds calculator
    Then the 54EC tenure should be fixed at 5 years
    And the 54EC info panel should mention 5 year lock-in

  @tax @regression @calculator-54ec
  Scenario: 54EC-21 Capital gains exemption on qualifying reinvestment
    Given I open the 54EC Bonds calculator
    When I enter 54EC inputs from golden "54EC-21"
    Then the 54EC exempted capital gain should match golden "54EC-21" within tolerance
    And the 54EC tax saved should match golden "54EC-21" within tolerance

  @tax @regression @calculator-54ec
  Scenario: 54EC-22 Interest taxable at income slab
    Given I open the 54EC Bonds calculator
    When I enter 54EC inputs from golden "54EC-22"
    Then the 54EC interest earned should match golden "54EC-22" within tolerance
    And the 54EC tax deducted should match golden "54EC-22" within tolerance
    And the 54EC info panel should mention interest taxable
