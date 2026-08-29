@calculator-equity

Feature: Equity Calculator

  As an investor

  I want to calculate direct equity returns (SIP or Lumpsum)

  So that I can plan market-linked investments with LTCG/STCG tax awareness



  Background:

    Given the default tax slab is 30 percent

    And inflation adjustment is off

    Given I am on the equity calculator page



  # ── Shared template EQ-01..EQ-15 ────────────────────────────────────────



  @smoke @regression @calculator-equity

  Scenario: EQ-01 Calculator loads with documented default values

    Then the equity investment type should be "sip"

    And the equity amount should be 5000

    And the equity tenure should be 5 years

    And the expected CAGR should be 12 percent



  @smoke @regression @calculator-equity

  Scenario: EQ-02 Results update in real time without Calculate button

    When I change the equity amount to 10000

    Then the equity corpus value should update without clicking calculate



  @smoke @tax @regression @calculator-equity

  Scenario: EQ-03 Results panel shows Money in Hand post-tax

    Then I should see the equity money in hand amount

    And the equity post-tax amount should be less than or equal to the corpus value



  @tax @regression @calculator-equity

  Scenario: EQ-04 Tax breakdown visible with rule explanation

    Then I should see the equity tax breakdown section

    And the equity tax rule should mention LTCG exemption



  @tax @regression @calculator-equity

  Scenario: EQ-05 Inflation toggle affects spending power when ON

    Given inflation adjustment is on

    When I view the equity results panel

    Then I should see equity actual spending power adjusted for inflation



  @smoke @regression @calculator-equity

  Scenario: EQ-06 Evolution table shows year-wise breakdown

    Then I should see the equity evolution table

    And the equity evolution table should have at least 1 year row



  @smoke @regression @calculator-equity

  Scenario: EQ-07 Info panel shows expected return rate

    Then I should see the equity info panel

    And the equity info panel should show expected return rate



  @edge @regression @calculator-equity

  Scenario: EQ-08 Invalid min amount shows inline validation error

    When I enter equity amount 499

    Then I should see equity validation error "Minimum investment amount is ₹500"



  @edge @regression @calculator-equity

  Scenario: EQ-09 Invalid max tenure shows inline validation error

    When I enter equity tenure 51 years

    Then I should see equity validation error "Maximum tenure is 50 years"



  @edge @regression @calculator-equity

  Scenario: EQ-10 Zero or empty input does not crash

    When I clear the equity amount

    Then the equity calculator should show empty results state

    And the equity page should not crash



  @edge @regression @calculator-equity

  Scenario: EQ-11 Negative input rejected or clamped

    When I enter equity amount -1000

    Then I should see an equity validation error or the value should be rejected



  @edge @regression @calculator-equity

  Scenario: EQ-12 Non-numeric input rejected

    When I enter equity amount "abc"

    Then I should see an equity validation error for amount



  @edge @regression @calculator-equity

  Scenario: EQ-13 Extremely large value handled without overflow

  # Golden: tests/fixtures/golden/equity.json#EQ-13

    When I enter equity amount 100000

    And I set equity tenure to 10 years

  # Expected corpus ≈ ₹2.32 Cr (tolerance ±₹5000)

    Then the equity corpus value should be approximately 23233908 within tolerance 5000



  @regression @tax @calculator-equity

  Scenario Outline: EQ-14 Golden calculation matches reference value

  # Examples from tests/fixtures/golden/equity.json

    When I set equity inputs from golden "<goldenId>"

    Then the equity corpus value should match golden "<goldenId>" field corpusValue

    And the equity post-tax amount should match golden "<goldenId>" field postTaxAmount



    Examples:

      | goldenId   |

      | EQ-14      |

      | EQ-22      |



  @edge @regression @calculator-equity

  Scenario: EQ-15 Pie chart renders or graceful fallback

    Then I should see the equity investment breakdown chart or fallback



  # ── Instrument-specific EQ-20..EQ-25 ────────────────────────────────────



  @regression @calculator-equity

  Scenario: EQ-20 SIP mode vs lumpsum mode produce different corpus values

  # Golden: tests/fixtures/golden/equity.json#EQ-20-SIP, EQ-20-LUMPSUM

    When I set equity inputs from golden "EQ-20-SIP"

    Then the equity corpus value should match golden "EQ-20-SIP" field corpusValue

    When I select equity investment type "lumpsum"

    And I set equity inputs from golden "EQ-20-LUMPSUM"

    Then the equity corpus value should match golden "EQ-20-LUMPSUM" field corpusValue



  @regression @calculator-equity

  Scenario: EQ-21 Step-up SIP percentage increase reflected in maturity

  # Golden: tests/fixtures/golden/equity.json#EQ-21

    Given equity step-up SIP is enabled

    When I set equity annual step-up percentage to 10

    And I enter equity amount 5000

    And I set equity tenure to 5 years

    Then the equity corpus value should be approximately 487411 within tolerance 100



  @tax @regression @calculator-equity

  Scenario: EQ-22 LTCG 10% above ₹1L exemption after 1 year

  # Golden: tests/fixtures/golden/equity.json#EQ-22

    When I enter equity amount 10000

    And I set equity tenure to 10 years

    Then the equity tax rate label should be "10% LTCG"

    And the equity tax amount should be approximately 102339 within tolerance 500



  @smoke @regression @calculator-equity

  Scenario: EQ-23 Risk warning displayed

    Then I should see the equity high risk investment warning



  @wip @tax @calculator-equity
  Scenario: EQ-24 STCG when tenure less than 1 year in UI
  # UI tenure is integer years (min 1); STCG covered in unit tests via EQ-22-STCG
    Given equity sub-year tenure is supported in UI
    When I set equity tenure to 0 years
    Then the equity tax rate label should be "15% STCG"



  @wip @calculator-equity

  Scenario: EQ-25 Dividend reinvestment projection

  # Dividend modeling not yet implemented in EquityCalculator

    Given equity dividend reinvestment mode is available

    When I configure dividend yield and reinvestment

    Then I should see dividend-adjusted corpus projection

