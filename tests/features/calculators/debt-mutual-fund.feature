@smoke @regression @tax @calculator-debt-mutual-fund
Feature: Debt Mutual Fund Calculator
  Debt mutual fund returns with indexation benefit for LTCG (>3 years) and income-slab STCG (<3 years).

  Background:
    Given the default tax slab is 30 percent
    And inflation adjustment is off
    Given I am on the debt mutual fund calculator page

  @smoke @calculator-debt-mutual-fund
  Scenario: DMF-01 Calculator loads with documented default values
    Then the debt MF investment type should be "sip"
    And the debt MF amount should be 5000
    And the debt MF tenure should be 5 years
    And the debt MF expected return should match the short-term fund default rate

  @smoke @calculator-debt-mutual-fund
  Scenario: DMF-02 Results update in real time without Calculate button
    When I change the debt MF amount to 10000
    Then the debt MF corpus value should update without clicking calculate

  @smoke @tax @calculator-debt-mutual-fund
  Scenario: DMF-03 Results panel shows Money in Hand post-tax
    Then I should see the debt MF money in hand amount
    And the debt MF post-tax amount should be less than or equal to the corpus value

  @tax @calculator-debt-mutual-fund
  Scenario: DMF-04 Tax breakdown visible with indexation rule explanation
    Then I should see the debt MF tax breakdown section
    And the debt MF tax rule should mention indexation benefit

  @tax @calculator-debt-mutual-fund
  Scenario: DMF-05 Inflation toggle affects spending power when ON
    Given inflation adjustment is on
    When I view the debt MF results panel
    Then I should see debt MF actual spending power adjusted for inflation

  @smoke @calculator-debt-mutual-fund
  Scenario: DMF-06 Evolution table shows year-wise breakdown
    Then I should see the debt MF evolution table
    And the debt MF evolution table should have at least 1 year row

  @smoke @calculator-debt-mutual-fund
  Scenario: DMF-07 Info panel shows expected return rates by fund type
    Then I should see the debt MF info panel
    And the debt MF info panel should show short-term debt return rate

  @edge @calculator-debt-mutual-fund
  Scenario: DMF-08 Invalid min amount shows inline validation error
    When I enter debt MF amount 499
    Then I should see debt MF validation error "Minimum investment amount is ₹500"

  @edge @calculator-debt-mutual-fund
  Scenario: DMF-09 Invalid max tenure shows inline validation error
    When I enter debt MF tenure 51 years
    Then I should see debt MF validation error "Maximum tenure is 50 years"

  @edge @calculator-debt-mutual-fund
  Scenario: DMF-10 Zero or empty input does not crash
    When I clear the debt MF amount
    Then the debt MF calculator should show empty results state
    And the debt MF page should not crash

  @edge @calculator-debt-mutual-fund
  Scenario: DMF-11 Negative input rejected or clamped
    When I enter debt MF amount -1000
    Then I should see a debt MF validation error or the value should be rejected

  @edge @calculator-debt-mutual-fund
  Scenario: DMF-12 Non-numeric input rejected
    When I enter debt MF amount "abc"
    Then I should see a debt MF validation error for amount

  @edge @calculator-debt-mutual-fund
  Scenario: DMF-13 Extremely large value handled without overflow
    When I enter debt MF amount 100000
    And I set debt MF tenure to 10 years
    Then the debt MF corpus value should be approximately 17904241 within tolerance 5000

  @regression @tax @calculator-debt-mutual-fund
  Scenario Outline: DMF-14 Golden calculation matches reference value
    When I set debt MF inputs from golden "<goldenId>"
    Then the debt MF corpus value should match golden "<goldenId>" field corpusValue
    And the debt MF post-tax amount should match golden "<goldenId>" field postTaxAmount

    Examples:
      | goldenId |
      | DMF-14   |
      | DMF-20   |

  @edge @calculator-debt-mutual-fund
  Scenario: DMF-15 Pie chart renders or graceful fallback
    Then I should see the debt MF investment breakdown chart or fallback

  @tax @regression @calculator-debt-mutual-fund
  Scenario: DMF-20 Indexation benefit reduces LTCG tax after 3 years
    When I set debt MF inputs from golden "DMF-20"
    Then the debt MF tax rate label should be "20% LTCG (Indexed)"
    And the debt MF tax amount should be approximately 5844 within tolerance 50
    And I should see debt MF indexation benefit details

  @tax @regression @calculator-debt-mutual-fund
  Scenario: DMF-21 STCG taxed at income slab when tenure under 3 years
    When I set debt MF inputs from golden "DMF-21-STCG"
    Then the debt MF tax rate label should be "30% slab"
    And the debt MF tax amount should be approximately 2952 within tolerance 50

  @tax @regression @calculator-debt-mutual-fund
  Scenario: DMF-21 LTCG indexation applies at exactly 3 years tenure boundary
    When I set debt MF inputs from golden "DMF-21-LTCG"
    Then the debt MF tax rate label should be "20% LTCG (Indexed)"
    And the debt MF post-tax amount should match golden "DMF-21-LTCG" field postTaxAmount

  @regression @calculator-debt-mutual-fund
  Scenario: DMF-22 SIP mode vs lumpsum mode produce different corpus values
    When I set debt MF inputs from golden "DMF-22-SIP"
    Then the debt MF corpus value should match golden "DMF-22-SIP" field corpusValue
    When I select debt MF investment type "lumpsum"
    And I set debt MF inputs from golden "DMF-22-LUMPSUM"
    Then the debt MF corpus value should match golden "DMF-22-LUMPSUM" field corpusValue
