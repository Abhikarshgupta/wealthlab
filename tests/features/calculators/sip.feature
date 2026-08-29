@calculator-sip
Feature: SIP Calculator
  As an investor
  I want to calculate Systematic Investment Plan returns
  So that I can plan monthly mutual fund investments with tax awareness

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off
    Given I am on the SIP calculator page

  # ── Shared template SIP-01..SIP-15 ──────────────────────────────────────

  @smoke @regression
  Scenario: SIP-01 Calculator loads with documented default values
    Then the monthly SIP amount should be 5000
    And the SIP investment tenure should be 5 years
    And the expected return should be 12 percent

  @smoke @regression
  Scenario: SIP-02 Results update in real time without Calculate button
    When I change the monthly SIP amount to 10000
    Then the corpus value should update without clicking calculate

  @smoke @tax @regression
  Scenario: SIP-03 Results panel shows Money in Hand post-tax
    Then I should see the money in hand amount
    And the post-tax amount should be less than or equal to the corpus value

  @tax @regression
  Scenario: SIP-04 Tax breakdown visible with rule explanation
    Then I should see the tax breakdown section
    And the tax rule should mention LTCG exemption

  @tax @regression
  Scenario: SIP-05 Inflation toggle affects spending power when ON
    Given inflation adjustment is on
    When I view the results panel
    Then I should see actual spending power adjusted for inflation

  @smoke @regression
  Scenario: SIP-06 Evolution table shows year-wise breakdown
    Then I should see the SIP evolution table
    And the evolution table should have at least 1 year row

  @smoke @regression
  Scenario: SIP-07 Info panel shows current rate and last updated
    Then I should see the SIP info panel
    And the info panel should show expected return rate

  @edge @regression
  Scenario: SIP-08 Invalid min amount shows inline validation error
    When I enter monthly SIP amount 499
    Then I should see validation error "Minimum SIP amount is ₹500"

  @edge @regression
  Scenario: SIP-09 Invalid max tenure shows inline validation error
    When I enter investment tenure 51 years
    Then I should see validation error "Maximum tenure is 50 years"

  @edge @regression
  Scenario: SIP-10 Zero or empty input does not crash
    When I clear the monthly SIP amount
    Then the calculator should show empty results state
    And the page should not crash

  @edge @regression
  Scenario: SIP-11 Negative input rejected or clamped
    When I enter monthly SIP amount -1000
    Then I should see a validation error or the value should be rejected

  @edge @regression
  Scenario: SIP-12 Non-numeric input rejected
    When I enter monthly SIP amount "abc"
    Then I should see a validation error for monthly SIP

  @edge @regression
  Scenario: SIP-13 Extremely large value handled without overflow
  # Golden: tests/fixtures/golden/sip.json#SIP-13
    When I enter monthly SIP amount 100000
    And I set investment tenure to 10 years
  # Expected corpus ≈ ₹2.32 Cr (tolerance ±₹5000)
    Then the corpus value should be approximately 23233908 within tolerance 5000

  @regression @tax
  Scenario Outline: SIP-14 Golden calculation matches reference value
  # Examples from tests/fixtures/golden/sip.json
    When I set SIP inputs from golden "<goldenId>"
    Then the corpus value should match golden "<goldenId>" field corpusValue
    And the post-tax amount should match golden "<goldenId>" field postTaxAmount

    Examples:
      | goldenId |
      | SIP-14   |
      | SIP-22   |

  @edge @regression
  Scenario: SIP-15 Pie chart renders or graceful fallback
    Then I should see the investment breakdown chart or fallback

  # ── Instrument-specific SIP-20..SIP-24 ──────────────────────────────────

  @edge @regression @calculator-sip
  Scenario: SIP-20 Minimum ₹500 per month accepted
  # Golden: tests/fixtures/golden/sip.json#SIP-20
    When I enter monthly SIP amount 500
    And I set investment tenure to 1 year
    Then I should not see validation error for monthly SIP
    And the corpus value should be approximately 6405 within tolerance 10

  @regression @calculator-sip
  Scenario: SIP-21 Step-up SIP percentage increase reflected in maturity
  # Golden: tests/fixtures/golden/sip.json#SIP-21
    Given step-up SIP is enabled
    When I set annual step-up percentage to 10
    And I enter monthly SIP amount 5000
    And I set investment tenure to 5 years
    Then the corpus value should be approximately 487411 within tolerance 100

  @tax @regression @calculator-sip
  Scenario: SIP-22 LTCG 12.5% above ₹1.25L exemption after 1 year
  # Golden: tests/fixtures/golden/sip.json#SIP-22
    When I enter monthly SIP amount 10000
    And I set investment tenure to 10 years
    Then the tax rate label should be "12.5% LTCG"
    And the tax amount should be approximately 124799 within tolerance 500

  @tax @edge @regression @calculator-sip
  Scenario: SIP-23 STCG when tenure less than 1 year
  # Golden: tests/fixtures/golden/sip.json#SIP-23
    When I enter monthly SIP amount 10000
    And I set investment tenure to 6 months
    Then the tax rate label should be "20% STCG"
    And the tax amount should be approximately 427 within tolerance 50

  @wip @known-bug @calculator-sip
  Scenario: SIP-24 SWP systematic withdrawal plan
  # Withdrawal phase not yet implemented in SIPCalculator
    Given SWP mode is available
    When I configure monthly withdrawal from corpus
    Then I should see SWP projection results
