@smoke @regression @tax @calculator-elss
Feature: ELSS Calculator
  As a tax-conscious investor
  I want to calculate ELSS returns with 3-year lock-in and Section 80C benefits
  So that I can plan equity-linked tax-saving investments

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off
    Given I am on the ELSS calculator page

  # ── Shared template ELSS-01..ELSS-15 ────────────────────────────────────

  @smoke @regression
  Scenario: ELSS-01 Calculator loads with documented default values
    Then the ELSS investment amount should be 5000
    And the ELSS investment tenure should be 5 years
    And the ELSS expected return should be 14 percent
    And the ELSS investment type should be SIP

  @smoke @regression
  Scenario: ELSS-02 Results update in real time without Calculate button
    When I change the ELSS investment amount to 10000
    Then the ELSS corpus value should update without clicking calculate

  @smoke @tax @regression
  Scenario: ELSS-03 Results panel shows Money in Hand post-tax
    Then I should see the ELSS money in hand amount
    And the ELSS post-tax amount should be less than or equal to the corpus value

  @tax @regression
  Scenario: ELSS-04 Tax breakdown visible with rule explanation
    Then I should see the ELSS tax breakdown section
    And the ELSS tax rule should mention LTCG exemption

  @tax @regression
  Scenario: ELSS-05 Inflation toggle affects spending power when ON
    Given inflation adjustment is on
    When I view the ELSS results panel
    Then I should see ELSS actual spending power adjusted for inflation

  @smoke @regression
  Scenario: ELSS-06 Evolution table shows year-wise breakdown
    Then I should see the ELSS evolution table
    And the ELSS evolution table should have at least 5 year rows

  @smoke @regression
  Scenario: ELSS-07 Info panel shows current rate and last updated
    Then I should see the ELSS info panel
    And the ELSS info panel should show expected return rate

  @edge @regression
  Scenario: ELSS-08 Invalid min amount shows inline validation error
    When I enter ELSS investment amount 499
    Then I should see ELSS validation error "Minimum investment amount is ₹500"

  @edge @regression
  Scenario: ELSS-09 Invalid min tenure shows lock-in validation error
    When I enter ELSS investment tenure 2 years
    Then I should see ELSS validation error "Minimum tenure is 3 years (ELSS lock-in requirement)"

  @edge @regression
  Scenario: ELSS-10 Zero or empty input does not crash
    When I clear the ELSS investment amount
    Then the ELSS calculator should show empty results state
    And the ELSS page should not crash

  @edge @regression
  Scenario: ELSS-11 Negative input rejected or clamped
    When I enter ELSS investment amount -1000
    Then I should see an ELSS validation error or the value should be rejected

  @edge @regression
  Scenario: ELSS-12 Non-numeric input rejected
    When I enter ELSS investment amount "abc"
    Then I should see a validation error for ELSS investment amount

  @edge @regression
  Scenario: ELSS-13 Extremely large value handled without overflow
  # Golden: tests/fixtures/golden/elss.json#ELSS-13
    When I enter ELSS investment amount 100000
    And I set ELSS investment tenure to 10 years
  # Expected corpus ≈ ₹2.62 Cr (tolerance ±₹5000)
    Then the ELSS corpus value should be approximately 26209138 within tolerance 5000

  @regression @tax
  Scenario Outline: ELSS-14 Golden calculation matches reference value
  # Examples from tests/fixtures/golden/elss.json
    When I set ELSS inputs from golden "<goldenId>"
    Then the ELSS corpus value should match golden "<goldenId>" field corpusValue
    And the ELSS post-tax amount should match golden "<goldenId>" field postTaxAmount

    Examples:
      | goldenId |
      | ELSS-14  |
      | ELSS-22  |

  @edge @regression
  Scenario: ELSS-15 Pie chart renders or graceful fallback
    Then I should see the ELSS investment breakdown chart or fallback

  # ── Instrument-specific ELSS-20..ELSS-25 ────────────────────────────────

  @edge @regression @calculator-elss
  Scenario: ELSS-20 Three-year lock-in enforced at minimum tenure
  # Golden: tests/fixtures/golden/elss.json#ELSS-20
    When I enter ELSS investment amount 500
    And I set ELSS investment tenure to 3 years
    Then I should not see ELSS validation error for investment amount
    And the ELSS corpus value should be approximately 22471 within tolerance 10

  @tax @regression @calculator-elss
  Scenario: ELSS-21 Section 80C benefit shown in info panel
    Then I should see the ELSS info panel
    And the ELSS info panel should mention Section 80C deduction

  @tax @regression @calculator-elss
  Scenario: ELSS-22 LTCG 10% above ₹1L exemption after 3+ years
  # Golden: tests/fixtures/golden/elss.json#ELSS-22
    When I enter ELSS investment amount 10000
    And I set ELSS investment tenure to 10 years
    Then the ELSS tax rate label should be "10% LTCG"
    And the ELSS tax amount should be approximately 132091 within tolerance 500

  @tax @edge @regression @known-bug @calculator-elss
  Scenario: ELSS-23 STCG when tenure less than 3 years
  # Golden: tests/fixtures/golden/elss.json#ELSS-23 — STCG math verified in unit layer
  # UI enforces 3-year lock-in (schema min tenure) so browser cannot reach STCG state
    When I enter ELSS investment amount 10000
    And I set ELSS investment tenure to 2 years
    Then the ELSS tax rate label should be "15% STCG"
    And the ELSS tax amount should be approximately 5751 within tolerance 50

  @regression @calculator-elss
  Scenario: ELSS-24 Lumpsum investment mode reflected in results
  # Golden: tests/fixtures/golden/elss.json#ELSS-21
    When I select ELSS investment type Lumpsum
    And I enter ELSS investment amount 150000
    And I set ELSS investment tenure to 3 years
    Then the ELSS corpus value should be approximately 222232 within tolerance 50

  @edge @regression @calculator-elss
  Scenario: ELSS-25 Maximum tenure boundary accepted
  # Golden: tests/fixtures/golden/elss.json#ELSS-BD-TENURE-50
    When I enter ELSS investment amount 5000
    And I set ELSS investment tenure to 50 years
    Then I should not see ELSS validation error for investment tenure
    And the ELSS corpus value should be approximately 456155035 within tolerance 50000
