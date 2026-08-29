@calculator-etf

Feature: ETF Calculator

  As an investor

  I want to calculate ETF returns (SIP or Lumpsum) across ETF types

  So that I can plan low-cost market investments with expense ratio and tax awareness



  Background:

    Given the default tax slab is 30 percent

    And inflation adjustment is off

    Given I am on the ETF calculator page



  # ── Shared template ETF-01..ETF-15 ────────────────────────────────────────



  @smoke @regression @calculator-etf

  Scenario: ETF-01 Calculator loads with documented default values

    Then the ETF investment type should be "sip"

    And the ETF amount should be 5000

    And the ETF tenure should be 5 years

    And the ETF expected CAGR should be 12 percent

    And the ETF expense ratio should be 0.2 percent

    And the ETF type should be "equity"



  @smoke @regression @calculator-etf

  Scenario: ETF-02 Results update in real time without Calculate button

    When I change the ETF amount to 10000

    Then the ETF corpus value should update without clicking calculate



  @smoke @tax @regression @calculator-etf

  Scenario: ETF-03 Results panel shows Money in Hand post-tax

    Then I should see the ETF money in hand amount

    And the ETF post-tax amount should be less than or equal to the corpus value



  @tax @regression @calculator-etf

  Scenario: ETF-04 Tax breakdown visible with rule explanation

    Then I should see the ETF tax breakdown section

    And the ETF tax rule should mention LTCG exemption



  @tax @regression @calculator-etf

  Scenario: ETF-05 Inflation toggle affects spending power when ON

    Given inflation adjustment is on

    When I view the ETF results panel

    Then I should see ETF actual spending power adjusted for inflation



  @smoke @regression @calculator-etf

  Scenario: ETF-06 Evolution table shows year-wise breakdown

    Then I should see the ETF evolution table

    And the ETF evolution table should have at least 1 year row



  @smoke @regression @calculator-etf

  Scenario: ETF-07 Info panel shows expected return rate

    Then I should see the ETF info panel

    And the ETF info panel should show expected return rate



  @edge @regression @calculator-etf

  Scenario: ETF-08 Invalid min amount shows inline validation error

    When I enter ETF amount 499

    Then I should see ETF validation error "Minimum investment amount is ₹500"



  @edge @regression @calculator-etf

  Scenario: ETF-09 Invalid max tenure shows inline validation error

    When I enter ETF tenure 51 years

    Then I should see ETF validation error "Maximum tenure is 50 years"



  @edge @regression @calculator-etf

  Scenario: ETF-10 Zero or empty input does not crash

    When I clear the ETF amount

    Then the ETF calculator should show empty results state

    And the ETF page should not crash



  @edge @regression @calculator-etf

  Scenario: ETF-11 Negative input rejected or clamped

    When I enter ETF amount -1000

    Then I should see an ETF validation error or the value should be rejected



  @edge @regression @calculator-etf

  Scenario: ETF-12 Non-numeric input rejected

    When I enter ETF amount "abc"

    Then I should see an ETF validation error for amount



  @edge @regression @calculator-etf

  Scenario: ETF-13 Extremely large value handled without overflow

  # Golden: tests/fixtures/golden/etf.json#ETF-13

    When I enter ETF amount 100000

    And I set ETF tenure to 10 years

  # Expected corpus ≈ ₹2.30 Cr (tolerance ±₹5000)

    Then the ETF corpus value should be approximately 22959197 within tolerance 5000



  @regression @tax @calculator-etf

  Scenario Outline: ETF-14 Golden calculation matches reference value

  # Examples from tests/fixtures/golden/etf.json

    When I set ETF inputs from golden "<goldenId>"

    Then the ETF corpus value should match golden "<goldenId>" field corpusValue

    And the ETF post-tax amount should match golden "<goldenId>" field postTaxAmount



    Examples:

      | goldenId   |

      | ETF-14     |

      | ETF-22     |



  @edge @regression @calculator-etf

  Scenario: ETF-15 Pie chart renders or graceful fallback

    Then I should see the ETF investment breakdown chart or fallback



  # ── Instrument-specific ETF-20..ETF-23 ────────────────────────────────────



  @regression @calculator-etf

  Scenario Outline: ETF-20 ETF type selection affects default CAGR and tax rules

  # Golden: tests/fixtures/golden/etf.json#ETF-22-*

    When I select ETF type "<etfType>"

    And I set ETF inputs from golden "<goldenId>"

    Then the ETF corpus value should match golden "<goldenId>" field corpusValue

    And the ETF tax rate label should be "<taxLabel>"



    Examples:

      | etfType       | goldenId      | taxLabel              |

      | equity        | ETF-14        | 12.5% LTCG            |

      | debt          | ETF-22-DEBT   | 20% LTCG (Indexed)    |

      | gold          | ETF-22-GOLD   | 20% LTCG (Indexed)    |

      | international | ETF-22-INTL   | 12.5% LTCG            |



  @regression @calculator-etf

  Scenario: ETF-21 SIP mode vs lumpsum mode produce different corpus values

  # Golden: tests/fixtures/golden/etf.json#ETF-20-SIP, ETF-20-LUMPSUM

    When I set ETF inputs from golden "ETF-20-SIP"

    Then the ETF corpus value should match golden "ETF-20-SIP" field corpusValue

    When I select ETF investment type "lumpsum"

    And I set ETF inputs from golden "ETF-20-LUMPSUM"

    Then the ETF corpus value should match golden "ETF-20-LUMPSUM" field corpusValue



  @regression @calculator-etf

  Scenario: ETF-21 Step-up SIP percentage increase reflected in maturity

  # Golden: tests/fixtures/golden/etf.json#ETF-21

    Given ETF step-up SIP is enabled

    When I set ETF annual step-up percentage to 10

    And I enter ETF amount 5000

    And I set ETF tenure to 5 years

    Then the ETF corpus value should be approximately 484990 within tolerance 100



  @regression @calculator-etf

  Scenario: ETF-22 Higher expense ratio reduces corpus vs lower expense ratio

  # Golden: tests/fixtures/golden/etf.json#ETF-23-EXPENSE, ETF-23-EXPENSE-LOW

    When I set ETF inputs from golden "ETF-23-EXPENSE-LOW"

    Then the ETF corpus value should match golden "ETF-23-EXPENSE-LOW" field corpusValue

    When I set ETF expense ratio to 0.5

    And I enter ETF amount 5000

    And I set ETF tenure to 5 years

    Then the ETF corpus value should match golden "ETF-23-EXPENSE" field corpusValue



  @tax @regression @calculator-etf

  Scenario: ETF-23 LTCG 12.5% above ₹1.25L exemption after 1 year

  # Golden: tests/fixtures/golden/etf.json#ETF-22

    When I enter ETF amount 10000

    And I set ETF tenure to 10 years

    Then the ETF tax rate label should be "12.5% LTCG"

    And the ETF tax amount should be approximately 121365 within tolerance 500



  @smoke @regression @calculator-etf

  Scenario: ETF-23 Market risk warning displayed

    Then I should see the ETF market risk warning



  @wip @tax @calculator-etf

  Scenario: ETF-23-STCG when tenure less than 1 year in UI

  # UI tenure is integer years (min 1); STCG covered in unit tests via ETF-22-STCG

    Given ETF sub-year tenure is supported in UI

    When I set ETF tenure to 0 years

    Then the ETF tax rate label should be "20% STCG"
