// Generated from: features\calculators\reits.feature
import { test } from "playwright-bdd";

test.describe('REITs Calculator', () => {

  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => { if (testInfo.error) return;
    await Given('the default tax slab is 30 percent', null, { page }); 
    await And('inflation adjustment is off', null, { page }); 
  });
  
  test('REIT-01 Calculator loads with documented default values', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, Then, And, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await Then('the REIT investment amount should be 100000', null, { page }); 
    await And('the REIT dividend yield should match the current REIT rate', null, { page }); 
    await And('the REIT capital appreciation should match the current REIT rate', null, { page }); 
    await And('the REIT tenure should be 5 years', null, { page }); 
    await And('the REIT results panel should be visible', null, { page }); 
  });

  test('REIT-02 Results update in real time without Calculate button', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I set REIT investment amount to 200000', null, { page }); 
    await Then('the REIT money in hand should update without clicking calculate', null, { page }); 
  });

  test('REIT-03 Results panel shows Money in Hand (post-tax)', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I enter REIT inputs from golden "REIT-03"', null, { page }); 
    await Then('the REIT money in hand should match golden "REIT-03" within tolerance', null, { page }); 
  });

  test('REIT-04 Tax breakdown visible with rule explanation', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I enter REIT inputs from golden "REIT-03"', null, { page }); 
    await Then('I should see the REIT tax breakdown section', null, { page }); 
    await And('the REIT tax rule should mention LTCG exemption', null, { page }); 
  });

  test('REIT-05 Inflation toggle affects spending power when ON', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await And('inflation adjustment is on', null, { page }); 
    await When('I enter REIT inputs from golden "REIT-14"', null, { page }); 
    await Then('the REIT spending power should be less than money in hand', null, { page }); 
  });

  test('REIT-06 Evolution table shows year-wise breakdown', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await Then('the REIT evolution table should show 5 year rows', null, { page }); 
  });

  test('REIT-07 Info panel shows expected return rates', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, Then, And, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await Then('the REIT info panel should show dividend yield rate', null, { page }); 
    await And('the REIT info panel should show capital appreciation rate', null, { page }); 
  });

  test('REIT-08 Invalid min amount shows inline validation error', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I set REIT investment amount to 999', null, { page }); 
    await Then('I should see REIT validation error containing "Minimum investment amount is"', null, { page }); 
  });

  test('REIT-09 Invalid max tenure shows inline validation error', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I set REIT tenure to 51 years', null, { page }); 
    await Then('I should see REIT validation error containing "Maximum tenure is 50 years"', null, { page }); 
  });

  test('REIT-10 Zero or empty input does not crash', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits', '@edge'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I clear REIT investment amount', null, { page }); 
    await Then('the REIT calculator should not crash', null, { page }); 
    await And('the REIT results panel should show empty state or validation', null, { page }); 
  });

  test('REIT-11 Negative input rejected or clamped', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I set REIT investment amount to -1000', null, { page }); 
    await Then('I should see a REIT validation error or clamped minimum value', null, { page }); 
  });

  test('REIT-12 Non-numeric input rejected', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I enter non-numeric REIT investment amount "abc"', null, { page }); 
    await Then('I should see a REIT validation error or unchanged numeric value', null, { page }); 
  });

  test('REIT-13 Extremely large investment handled without overflow', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I enter REIT inputs from golden "REIT-13"', null, { page }); 
    await Then('the REIT results panel should display money in hand', null, { page }); 
  });

  test.describe('REIT-14 Golden calculation matches reference value', () => {

    test('Example #1', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('I open the REITs calculator', null, { page }); 
      await When('I enter REIT inputs from golden "REIT-14"', null, { page }); 
      await Then('the REIT final value should match golden "REIT-14" within tolerance', null, { page }); 
      await And('the REIT money in hand should match golden "REIT-14" within tolerance', null, { page }); 
    });

    test('Example #2', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('I open the REITs calculator', null, { page }); 
      await When('I enter REIT inputs from golden "REIT-03"', null, { page }); 
      await Then('the REIT final value should match golden "REIT-03" within tolerance', null, { page }); 
      await And('the REIT money in hand should match golden "REIT-03" within tolerance', null, { page }); 
    });

  });

  test('REIT-15 Pie chart renders investment breakdown', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits', '@edge'] }, async ({ Given, Then, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await Then('the REIT pie chart should render or show graceful fallback', null, { page }); 
  });

  test('REIT-20 Dividend income and capital appreciation tracked separately', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I enter REIT inputs from golden "REIT-20"', null, { page }); 
    await Then('the REIT investment breakdown should show dividend and capital gain segments', null, { page }); 
    await And('the REIT final value should match golden "REIT-20" within tolerance', null, { page }); 
  });

  test('REIT-21 LTCG tax above exemption for long holding period', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the REITs calculator', null, { page }); 
    await When('I enter REIT inputs from golden "REIT-21-LTCG"', null, { page }); 
    await Then('the REIT tax rate label should be "12.5% LTCG"', null, { page }); 
    await And('the REIT tax amount should match golden "REIT-21-LTCG" within tolerance', null, { page }); 
  });

  test('REIT-21 STCG when tenure less than 1 year in UI', { tag: ['@smoke', '@regression', '@tax', '@calculator-reits', '@wip'] }, async ({ Given, When, Then, page }) => { 
    await Given('REIT sub-year tenure is supported in UI'); 
    await When('I set REIT tenure to 0 years', null, { page }); 
    await Then('the REIT tax rate label should be "20% STCG"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\calculators\\reits.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":11,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then the REIT investment amount should be 100000","stepMatchArguments":[{"group":{"start":37,"value":"100000"},"parameterTypeName":"int"}]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the REIT dividend yield should match the current REIT rate","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the REIT capital appreciation should match the current REIT rate","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the REIT tenure should be 5 years","stepMatchArguments":[{"group":{"start":26,"value":"5"},"parameterTypeName":"int"}]},{"pwStepLine":17,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the REIT results panel should be visible","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":20,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I set REIT investment amount to 200000","stepMatchArguments":[{"group":{"start":32,"value":"200000"},"parameterTypeName":"int"}]},{"pwStepLine":23,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then the REIT money in hand should update without clicking calculate","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":26,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":27,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When I enter REIT inputs from golden \"REIT-03\"","stepMatchArguments":[{"group":{"start":32,"value":"\"REIT-03\"","children":[{"start":33,"value":"REIT-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then the REIT money in hand should match golden \"REIT-03\" within tolerance","stepMatchArguments":[{"group":{"start":43,"value":"\"REIT-03\"","children":[{"start":44,"value":"REIT-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":32,"pickleLine":32,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":33,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"When I enter REIT inputs from golden \"REIT-03\"","stepMatchArguments":[{"group":{"start":32,"value":"\"REIT-03\"","children":[{"start":33,"value":"REIT-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then I should see the REIT tax breakdown section","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"And the REIT tax rule should mention LTCG exemption","stepMatchArguments":[]}]},
  {"pwTestLine":39,"pickleLine":39,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":41,"keywordType":"Context","textWithKeyword":"And inflation adjustment is on","stepMatchArguments":[]},{"pwStepLine":42,"gherkinStepLine":42,"keywordType":"Action","textWithKeyword":"When I enter REIT inputs from golden \"REIT-14\"","stepMatchArguments":[{"group":{"start":32,"value":"\"REIT-14\"","children":[{"start":33,"value":"REIT-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":43,"gherkinStepLine":43,"keywordType":"Outcome","textWithKeyword":"Then the REIT spending power should be less than money in hand","stepMatchArguments":[]}]},
  {"pwTestLine":46,"pickleLine":46,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":47,"gherkinStepLine":47,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Then the REIT evolution table should show 5 year rows","stepMatchArguments":[{"group":{"start":37,"value":"5"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":51,"pickleLine":51,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":52,"gherkinStepLine":52,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":53,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"Then the REIT info panel should show dividend yield rate","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"And the REIT info panel should show capital appreciation rate","stepMatchArguments":[]}]},
  {"pwTestLine":57,"pickleLine":57,"tags":["@smoke","@regression","@tax","@calculator-reits","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":58,"gherkinStepLine":58,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":59,"gherkinStepLine":59,"keywordType":"Action","textWithKeyword":"When I set REIT investment amount to 999","stepMatchArguments":[{"group":{"start":32,"value":"999"},"parameterTypeName":"int"}]},{"pwStepLine":60,"gherkinStepLine":60,"keywordType":"Outcome","textWithKeyword":"Then I should see REIT validation error containing \"Minimum investment amount is\"","stepMatchArguments":[{"group":{"start":46,"value":"\"Minimum investment amount is\"","children":[{"start":47,"value":"Minimum investment amount is","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":63,"pickleLine":63,"tags":["@smoke","@regression","@tax","@calculator-reits","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":64,"gherkinStepLine":64,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":65,"keywordType":"Action","textWithKeyword":"When I set REIT tenure to 51 years","stepMatchArguments":[{"group":{"start":21,"value":"51"},"parameterTypeName":"int"}]},{"pwStepLine":66,"gherkinStepLine":66,"keywordType":"Outcome","textWithKeyword":"Then I should see REIT validation error containing \"Maximum tenure is 50 years\"","stepMatchArguments":[{"group":{"start":46,"value":"\"Maximum tenure is 50 years\"","children":[{"start":47,"value":"Maximum tenure is 50 years","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":69,"pickleLine":69,"tags":["@smoke","@regression","@tax","@calculator-reits","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":70,"gherkinStepLine":70,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":71,"gherkinStepLine":71,"keywordType":"Action","textWithKeyword":"When I clear REIT investment amount","stepMatchArguments":[]},{"pwStepLine":72,"gherkinStepLine":72,"keywordType":"Outcome","textWithKeyword":"Then the REIT calculator should not crash","stepMatchArguments":[]},{"pwStepLine":73,"gherkinStepLine":73,"keywordType":"Outcome","textWithKeyword":"And the REIT results panel should show empty state or validation","stepMatchArguments":[]}]},
  {"pwTestLine":76,"pickleLine":76,"tags":["@smoke","@regression","@tax","@calculator-reits","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":77,"gherkinStepLine":77,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":78,"gherkinStepLine":78,"keywordType":"Action","textWithKeyword":"When I set REIT investment amount to -1000","stepMatchArguments":[{"group":{"start":32,"value":"-1000"},"parameterTypeName":"int"}]},{"pwStepLine":79,"gherkinStepLine":79,"keywordType":"Outcome","textWithKeyword":"Then I should see a REIT validation error or clamped minimum value","stepMatchArguments":[]}]},
  {"pwTestLine":82,"pickleLine":82,"tags":["@smoke","@regression","@tax","@calculator-reits","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":83,"gherkinStepLine":83,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":84,"gherkinStepLine":84,"keywordType":"Action","textWithKeyword":"When I enter non-numeric REIT investment amount \"abc\"","stepMatchArguments":[{"group":{"start":43,"value":"\"abc\"","children":[{"start":44,"value":"abc","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":85,"gherkinStepLine":85,"keywordType":"Outcome","textWithKeyword":"Then I should see a REIT validation error or unchanged numeric value","stepMatchArguments":[]}]},
  {"pwTestLine":88,"pickleLine":88,"tags":["@smoke","@regression","@tax","@calculator-reits","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":89,"gherkinStepLine":89,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":90,"gherkinStepLine":90,"keywordType":"Action","textWithKeyword":"When I enter REIT inputs from golden \"REIT-13\"","stepMatchArguments":[{"group":{"start":32,"value":"\"REIT-13\"","children":[{"start":33,"value":"REIT-13","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":91,"gherkinStepLine":91,"keywordType":"Outcome","textWithKeyword":"Then the REIT results panel should display money in hand","stepMatchArguments":[]}]},
  {"pwTestLine":96,"pickleLine":102,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":97,"gherkinStepLine":95,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":98,"gherkinStepLine":96,"keywordType":"Action","textWithKeyword":"When I enter REIT inputs from golden \"REIT-14\"","stepMatchArguments":[{"group":{"start":32,"value":"\"REIT-14\"","children":[{"start":33,"value":"REIT-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":99,"gherkinStepLine":97,"keywordType":"Outcome","textWithKeyword":"Then the REIT final value should match golden \"REIT-14\" within tolerance","stepMatchArguments":[{"group":{"start":41,"value":"\"REIT-14\"","children":[{"start":42,"value":"REIT-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":100,"gherkinStepLine":98,"keywordType":"Outcome","textWithKeyword":"And the REIT money in hand should match golden \"REIT-14\" within tolerance","stepMatchArguments":[{"group":{"start":43,"value":"\"REIT-14\"","children":[{"start":44,"value":"REIT-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":103,"pickleLine":103,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":104,"gherkinStepLine":95,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":105,"gherkinStepLine":96,"keywordType":"Action","textWithKeyword":"When I enter REIT inputs from golden \"REIT-03\"","stepMatchArguments":[{"group":{"start":32,"value":"\"REIT-03\"","children":[{"start":33,"value":"REIT-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":106,"gherkinStepLine":97,"keywordType":"Outcome","textWithKeyword":"Then the REIT final value should match golden \"REIT-03\" within tolerance","stepMatchArguments":[{"group":{"start":41,"value":"\"REIT-03\"","children":[{"start":42,"value":"REIT-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":107,"gherkinStepLine":98,"keywordType":"Outcome","textWithKeyword":"And the REIT money in hand should match golden \"REIT-03\" within tolerance","stepMatchArguments":[{"group":{"start":43,"value":"\"REIT-03\"","children":[{"start":44,"value":"REIT-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":112,"pickleLine":106,"tags":["@smoke","@regression","@tax","@calculator-reits","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":113,"gherkinStepLine":107,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":114,"gherkinStepLine":108,"keywordType":"Outcome","textWithKeyword":"Then the REIT pie chart should render or show graceful fallback","stepMatchArguments":[]}]},
  {"pwTestLine":117,"pickleLine":111,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":118,"gherkinStepLine":112,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":119,"gherkinStepLine":113,"keywordType":"Action","textWithKeyword":"When I enter REIT inputs from golden \"REIT-20\"","stepMatchArguments":[{"group":{"start":32,"value":"\"REIT-20\"","children":[{"start":33,"value":"REIT-20","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":120,"gherkinStepLine":114,"keywordType":"Outcome","textWithKeyword":"Then the REIT investment breakdown should show dividend and capital gain segments","stepMatchArguments":[]},{"pwStepLine":121,"gherkinStepLine":115,"keywordType":"Outcome","textWithKeyword":"And the REIT final value should match golden \"REIT-20\" within tolerance","stepMatchArguments":[{"group":{"start":41,"value":"\"REIT-20\"","children":[{"start":42,"value":"REIT-20","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":124,"pickleLine":118,"tags":["@smoke","@regression","@tax","@calculator-reits"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":125,"gherkinStepLine":119,"keywordType":"Context","textWithKeyword":"Given I open the REITs calculator","stepMatchArguments":[]},{"pwStepLine":126,"gherkinStepLine":120,"keywordType":"Action","textWithKeyword":"When I enter REIT inputs from golden \"REIT-21-LTCG\"","stepMatchArguments":[{"group":{"start":32,"value":"\"REIT-21-LTCG\"","children":[{"start":33,"value":"REIT-21-LTCG","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":127,"gherkinStepLine":121,"keywordType":"Outcome","textWithKeyword":"Then the REIT tax rate label should be \"12.5% LTCG\"","stepMatchArguments":[{"group":{"start":34,"value":"\"12.5% LTCG\"","children":[{"start":35,"value":"12.5% LTCG","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":128,"gherkinStepLine":122,"keywordType":"Outcome","textWithKeyword":"And the REIT tax amount should match golden \"REIT-21-LTCG\" within tolerance","stepMatchArguments":[{"group":{"start":40,"value":"\"REIT-21-LTCG\"","children":[{"start":41,"value":"REIT-21-LTCG","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":131,"pickleLine":125,"tags":["@smoke","@regression","@tax","@calculator-reits","@wip"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":132,"gherkinStepLine":127,"keywordType":"Context","textWithKeyword":"Given REIT sub-year tenure is supported in UI","stepMatchArguments":[]},{"pwStepLine":133,"gherkinStepLine":128,"keywordType":"Action","textWithKeyword":"When I set REIT tenure to 0 years","stepMatchArguments":[{"group":{"start":21,"value":"0"},"parameterTypeName":"int"}]},{"pwStepLine":134,"gherkinStepLine":129,"keywordType":"Outcome","textWithKeyword":"Then the REIT tax rate label should be \"20% STCG\"","stepMatchArguments":[{"group":{"start":34,"value":"\"20% STCG\"","children":[{"start":35,"value":"20% STCG","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end