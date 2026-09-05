// Generated from: features\calculators\scss.feature
import { test } from "playwright-bdd";

test.describe('SCSS Calculator', () => {

  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => { if (testInfo.error) return;
    await Given('the default tax slab is 30 percent', null, { page }); 
    await And('inflation adjustment is off', null, { page }); 
  });
  
  test('SCSS-01 Calculator loads with documented default values', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, Then, And, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await Then('the SCSS investment amount should be 1000000', null, { page }); 
    await And('the SCSS tenure should be 5 years', null, { page }); 
    await And('the SCSS senior age should be 65', null, { page }); 
    await And('the SCSS interest rate should match the current SCSS rate', null, { page }); 
    await And('the SCSS results panel should be visible', null, { page }); 
  });

  test('SCSS-02 Results update in real time without Calculate button', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I set SCSS investment amount to 500000', null, { page }); 
    await Then('the SCSS maturity amount should update without clicking calculate', null, { page }); 
  });

  test('SCSS-03 Results panel shows Money in Hand (post-tax)', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I enter SCSS inputs from golden "SCSS-03"', null, { page }); 
    await Then('the SCSS money in hand should match golden "SCSS-03" within tolerance', null, { page }); 
  });

  test('SCSS-04 Tax breakdown visible with rule explanation', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I enter SCSS inputs from golden "SCSS-03"', null, { page }); 
    await Then('I should see the SCSS tax breakdown section', null, { page }); 
    await And('the SCSS tax rule should mention interest taxed per income slab', null, { page }); 
  });

  test('SCSS-05 Inflation toggle affects spending power when ON', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await And('inflation adjustment is on', null, { page }); 
    await When('I enter SCSS inputs from golden "SCSS-14"', null, { page }); 
    await Then('the SCSS spending power should be less than money in hand', null, { page }); 
  });

  test('SCSS-06 Evolution table shows year-wise breakdown', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await Then('the SCSS evolution table should show 5 year rows', null, { page }); 
  });

  test('SCSS-07 Info panel shows current rate and last updated', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, Then, And, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await Then('the SCSS info panel should show current SCSS interest rate', null, { page }); 
    await And('the SCSS info panel should show last updated date', null, { page }); 
  });

  test('SCSS-08 Invalid min amount shows inline validation error', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I set SCSS investment amount to 999', null, { page }); 
    await Then('I should see SCSS validation error containing "Minimum investment amount is"', null, { page }); 
  });

  test('SCSS-09 Invalid max amount shows inline validation error', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I set SCSS investment amount to 3000001', null, { page }); 
    await Then('I should see SCSS validation error containing "Maximum investment amount is"', null, { page }); 
  });

  test('SCSS-10 Zero or empty input does not crash', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I clear SCSS investment amount', null, { page }); 
    await Then('the SCSS calculator should not crash', null, { page }); 
    await And('the SCSS results panel should show empty state or validation', null, { page }); 
  });

  test('SCSS-11 Negative input rejected or clamped', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I set SCSS investment amount to -1000', null, { page }); 
    await Then('I should see an SCSS validation error or clamped minimum value', null, { page }); 
  });

  test('SCSS-12 Non-numeric input rejected', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I enter non-numeric SCSS investment amount "abc"', null, { page }); 
    await Then('I should see an SCSS validation error or unchanged numeric value', null, { page }); 
  });

  test('SCSS-13 Extremely large value handled without overflow', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I set SCSS investment amount to 3000000', null, { page }); 
    await Then('the SCSS results panel should display a maturity amount', null, { page }); 
  });

  test.describe('SCSS-14 Golden calculation matches reference value', () => {

    test('Example #1', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('I open the SCSS calculator', null, { page }); 
      await When('I enter SCSS inputs from golden "SCSS-14"', null, { page }); 
      await Then('the SCSS maturity amount should match golden "SCSS-14" within tolerance', null, { page }); 
      await And('the SCSS quarterly interest should match golden "SCSS-14" within tolerance', null, { page }); 
    });

    test('Example #2', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('I open the SCSS calculator', null, { page }); 
      await When('I enter SCSS inputs from golden "SCSS-14-max"', null, { page }); 
      await Then('the SCSS maturity amount should match golden "SCSS-14-max" within tolerance', null, { page }); 
      await And('the SCSS quarterly interest should match golden "SCSS-14-max" within tolerance', null, { page }); 
    });

  });

  test('SCSS-15 Pie chart renders investment breakdown', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await Then('the SCSS pie chart should render or show graceful fallback', null, { page }); 
  });

  test('SCSS-20 Age 60+ validation for senior eligibility', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I set SCSS senior age to 59', null, { page }); 
    await Then('I should see SCSS validation error containing "Minimum age is 60 years"', null, { page }); 
    await When('I set SCSS senior age to 60', null, { page }); 
    await Then('I should not see SCSS validation error for minimum age', null, { page }); 
  });

  test('SCSS-21 Maximum principal capped at 30 lakh', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I set SCSS investment amount to 3000000', null, { page }); 
    await Then('I should not see SCSS validation error for maximum investment', null, { page }); 
    await When('I set SCSS investment amount to 3000001', null, { page }); 
    await Then('I should see SCSS validation error containing "Maximum investment amount is"', null, { page }); 
  });

  test('SCSS-22 Quarterly interest payout displayed in results', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I enter SCSS inputs from golden "SCSS-22"', null, { page }); 
    await Then('the SCSS quarterly interest should match golden "SCSS-22" within tolerance', null, { page }); 
    await And('the SCSS info panel should mention quarterly interest', null, { page }); 
  });

  test('SCSS-23 TDS on interest above threshold', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I enter SCSS inputs from golden "SCSS-23"', null, { page }); 
    await Then('I should see SCSS TDS information in tax breakdown', null, { page }); 
    await And('the SCSS annual interest should exceed 40000', null, { page }); 
  });

  test('SCSS-25 Premature closure not yet implemented', { tag: ['@smoke', '@regression', '@tax', '@calculator-scss', '@wip'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SCSS calculator', null, { page }); 
    await When('I request SCSS premature closure calculation'); 
    await Then('the SCSS premature closure feature should be marked not implemented'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\calculators\\scss.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":11,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then the SCSS investment amount should be 1000000","stepMatchArguments":[{"group":{"start":37,"value":"1000000"},"parameterTypeName":"int"}]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the SCSS tenure should be 5 years","stepMatchArguments":[{"group":{"start":26,"value":"5"},"parameterTypeName":"int"}]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the SCSS senior age should be 65","stepMatchArguments":[{"group":{"start":30,"value":"65"},"parameterTypeName":"int"}]},{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the SCSS interest rate should match the current SCSS rate","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the SCSS results panel should be visible","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":20,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I set SCSS investment amount to 500000","stepMatchArguments":[{"group":{"start":32,"value":"500000"},"parameterTypeName":"int"}]},{"pwStepLine":23,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then the SCSS maturity amount should update without clicking calculate","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":26,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":27,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When I enter SCSS inputs from golden \"SCSS-03\"","stepMatchArguments":[{"group":{"start":32,"value":"\"SCSS-03\"","children":[{"start":33,"value":"SCSS-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then the SCSS money in hand should match golden \"SCSS-03\" within tolerance","stepMatchArguments":[{"group":{"start":43,"value":"\"SCSS-03\"","children":[{"start":44,"value":"SCSS-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":32,"pickleLine":32,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":33,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"When I enter SCSS inputs from golden \"SCSS-03\"","stepMatchArguments":[{"group":{"start":32,"value":"\"SCSS-03\"","children":[{"start":33,"value":"SCSS-03","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then I should see the SCSS tax breakdown section","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"And the SCSS tax rule should mention interest taxed per income slab","stepMatchArguments":[]}]},
  {"pwTestLine":39,"pickleLine":39,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":41,"keywordType":"Context","textWithKeyword":"And inflation adjustment is on","stepMatchArguments":[]},{"pwStepLine":42,"gherkinStepLine":42,"keywordType":"Action","textWithKeyword":"When I enter SCSS inputs from golden \"SCSS-14\"","stepMatchArguments":[{"group":{"start":32,"value":"\"SCSS-14\"","children":[{"start":33,"value":"SCSS-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":43,"gherkinStepLine":43,"keywordType":"Outcome","textWithKeyword":"Then the SCSS spending power should be less than money in hand","stepMatchArguments":[]}]},
  {"pwTestLine":46,"pickleLine":46,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":47,"gherkinStepLine":47,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Then the SCSS evolution table should show 5 year rows","stepMatchArguments":[{"group":{"start":37,"value":"5"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":51,"pickleLine":51,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":52,"gherkinStepLine":52,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":53,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"Then the SCSS info panel should show current SCSS interest rate","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"And the SCSS info panel should show last updated date","stepMatchArguments":[]}]},
  {"pwTestLine":57,"pickleLine":57,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":58,"gherkinStepLine":58,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":59,"gherkinStepLine":59,"keywordType":"Action","textWithKeyword":"When I set SCSS investment amount to 999","stepMatchArguments":[{"group":{"start":32,"value":"999"},"parameterTypeName":"int"}]},{"pwStepLine":60,"gherkinStepLine":60,"keywordType":"Outcome","textWithKeyword":"Then I should see SCSS validation error containing \"Minimum investment amount is\"","stepMatchArguments":[{"group":{"start":46,"value":"\"Minimum investment amount is\"","children":[{"start":47,"value":"Minimum investment amount is","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":63,"pickleLine":63,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":64,"gherkinStepLine":64,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":65,"keywordType":"Action","textWithKeyword":"When I set SCSS investment amount to 3000001","stepMatchArguments":[{"group":{"start":32,"value":"3000001"},"parameterTypeName":"int"}]},{"pwStepLine":66,"gherkinStepLine":66,"keywordType":"Outcome","textWithKeyword":"Then I should see SCSS validation error containing \"Maximum investment amount is\"","stepMatchArguments":[{"group":{"start":46,"value":"\"Maximum investment amount is\"","children":[{"start":47,"value":"Maximum investment amount is","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":69,"pickleLine":69,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":70,"gherkinStepLine":70,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":71,"gherkinStepLine":71,"keywordType":"Action","textWithKeyword":"When I clear SCSS investment amount","stepMatchArguments":[]},{"pwStepLine":72,"gherkinStepLine":72,"keywordType":"Outcome","textWithKeyword":"Then the SCSS calculator should not crash","stepMatchArguments":[]},{"pwStepLine":73,"gherkinStepLine":73,"keywordType":"Outcome","textWithKeyword":"And the SCSS results panel should show empty state or validation","stepMatchArguments":[]}]},
  {"pwTestLine":76,"pickleLine":76,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":77,"gherkinStepLine":77,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":78,"gherkinStepLine":78,"keywordType":"Action","textWithKeyword":"When I set SCSS investment amount to -1000","stepMatchArguments":[{"group":{"start":32,"value":"-1000"},"parameterTypeName":"int"}]},{"pwStepLine":79,"gherkinStepLine":79,"keywordType":"Outcome","textWithKeyword":"Then I should see an SCSS validation error or clamped minimum value","stepMatchArguments":[]}]},
  {"pwTestLine":82,"pickleLine":82,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":83,"gherkinStepLine":83,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":84,"gherkinStepLine":84,"keywordType":"Action","textWithKeyword":"When I enter non-numeric SCSS investment amount \"abc\"","stepMatchArguments":[{"group":{"start":43,"value":"\"abc\"","children":[{"start":44,"value":"abc","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":85,"gherkinStepLine":85,"keywordType":"Outcome","textWithKeyword":"Then I should see an SCSS validation error or unchanged numeric value","stepMatchArguments":[]}]},
  {"pwTestLine":88,"pickleLine":88,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":89,"gherkinStepLine":89,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":90,"gherkinStepLine":90,"keywordType":"Action","textWithKeyword":"When I set SCSS investment amount to 3000000","stepMatchArguments":[{"group":{"start":32,"value":"3000000"},"parameterTypeName":"int"}]},{"pwStepLine":91,"gherkinStepLine":91,"keywordType":"Outcome","textWithKeyword":"Then the SCSS results panel should display a maturity amount","stepMatchArguments":[]}]},
  {"pwTestLine":96,"pickleLine":102,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":97,"gherkinStepLine":95,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":98,"gherkinStepLine":96,"keywordType":"Action","textWithKeyword":"When I enter SCSS inputs from golden \"SCSS-14\"","stepMatchArguments":[{"group":{"start":32,"value":"\"SCSS-14\"","children":[{"start":33,"value":"SCSS-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":99,"gherkinStepLine":97,"keywordType":"Outcome","textWithKeyword":"Then the SCSS maturity amount should match golden \"SCSS-14\" within tolerance","stepMatchArguments":[{"group":{"start":45,"value":"\"SCSS-14\"","children":[{"start":46,"value":"SCSS-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":100,"gherkinStepLine":98,"keywordType":"Outcome","textWithKeyword":"And the SCSS quarterly interest should match golden \"SCSS-14\" within tolerance","stepMatchArguments":[{"group":{"start":48,"value":"\"SCSS-14\"","children":[{"start":49,"value":"SCSS-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":103,"pickleLine":103,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":104,"gherkinStepLine":95,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":105,"gherkinStepLine":96,"keywordType":"Action","textWithKeyword":"When I enter SCSS inputs from golden \"SCSS-14-max\"","stepMatchArguments":[{"group":{"start":32,"value":"\"SCSS-14-max\"","children":[{"start":33,"value":"SCSS-14-max","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":106,"gherkinStepLine":97,"keywordType":"Outcome","textWithKeyword":"Then the SCSS maturity amount should match golden \"SCSS-14-max\" within tolerance","stepMatchArguments":[{"group":{"start":45,"value":"\"SCSS-14-max\"","children":[{"start":46,"value":"SCSS-14-max","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":107,"gherkinStepLine":98,"keywordType":"Outcome","textWithKeyword":"And the SCSS quarterly interest should match golden \"SCSS-14-max\" within tolerance","stepMatchArguments":[{"group":{"start":48,"value":"\"SCSS-14-max\"","children":[{"start":49,"value":"SCSS-14-max","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":112,"pickleLine":106,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":113,"gherkinStepLine":107,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":114,"gherkinStepLine":108,"keywordType":"Outcome","textWithKeyword":"Then the SCSS pie chart should render or show graceful fallback","stepMatchArguments":[]}]},
  {"pwTestLine":117,"pickleLine":111,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":118,"gherkinStepLine":112,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":119,"gherkinStepLine":113,"keywordType":"Action","textWithKeyword":"When I set SCSS senior age to 59","stepMatchArguments":[{"group":{"start":25,"value":"59"},"parameterTypeName":"int"}]},{"pwStepLine":120,"gherkinStepLine":114,"keywordType":"Outcome","textWithKeyword":"Then I should see SCSS validation error containing \"Minimum age is 60 years\"","stepMatchArguments":[{"group":{"start":46,"value":"\"Minimum age is 60 years\"","children":[{"start":47,"value":"Minimum age is 60 years","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":121,"gherkinStepLine":115,"keywordType":"Action","textWithKeyword":"When I set SCSS senior age to 60","stepMatchArguments":[{"group":{"start":25,"value":"60"},"parameterTypeName":"int"}]},{"pwStepLine":122,"gherkinStepLine":116,"keywordType":"Outcome","textWithKeyword":"Then I should not see SCSS validation error for minimum age","stepMatchArguments":[]}]},
  {"pwTestLine":125,"pickleLine":119,"tags":["@smoke","@regression","@tax","@calculator-scss","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":126,"gherkinStepLine":120,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":127,"gherkinStepLine":121,"keywordType":"Action","textWithKeyword":"When I set SCSS investment amount to 3000000","stepMatchArguments":[{"group":{"start":32,"value":"3000000"},"parameterTypeName":"int"}]},{"pwStepLine":128,"gherkinStepLine":122,"keywordType":"Outcome","textWithKeyword":"Then I should not see SCSS validation error for maximum investment","stepMatchArguments":[]},{"pwStepLine":129,"gherkinStepLine":123,"keywordType":"Action","textWithKeyword":"When I set SCSS investment amount to 3000001","stepMatchArguments":[{"group":{"start":32,"value":"3000001"},"parameterTypeName":"int"}]},{"pwStepLine":130,"gherkinStepLine":124,"keywordType":"Outcome","textWithKeyword":"Then I should see SCSS validation error containing \"Maximum investment amount is\"","stepMatchArguments":[{"group":{"start":46,"value":"\"Maximum investment amount is\"","children":[{"start":47,"value":"Maximum investment amount is","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":133,"pickleLine":127,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":134,"gherkinStepLine":128,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":135,"gherkinStepLine":129,"keywordType":"Action","textWithKeyword":"When I enter SCSS inputs from golden \"SCSS-22\"","stepMatchArguments":[{"group":{"start":32,"value":"\"SCSS-22\"","children":[{"start":33,"value":"SCSS-22","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":136,"gherkinStepLine":130,"keywordType":"Outcome","textWithKeyword":"Then the SCSS quarterly interest should match golden \"SCSS-22\" within tolerance","stepMatchArguments":[{"group":{"start":48,"value":"\"SCSS-22\"","children":[{"start":49,"value":"SCSS-22","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":137,"gherkinStepLine":131,"keywordType":"Outcome","textWithKeyword":"And the SCSS info panel should mention quarterly interest","stepMatchArguments":[]}]},
  {"pwTestLine":140,"pickleLine":134,"tags":["@smoke","@regression","@tax","@calculator-scss"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":141,"gherkinStepLine":135,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":142,"gherkinStepLine":136,"keywordType":"Action","textWithKeyword":"When I enter SCSS inputs from golden \"SCSS-23\"","stepMatchArguments":[{"group":{"start":32,"value":"\"SCSS-23\"","children":[{"start":33,"value":"SCSS-23","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":143,"gherkinStepLine":137,"keywordType":"Outcome","textWithKeyword":"Then I should see SCSS TDS information in tax breakdown","stepMatchArguments":[]},{"pwStepLine":144,"gherkinStepLine":138,"keywordType":"Outcome","textWithKeyword":"And the SCSS annual interest should exceed 40000","stepMatchArguments":[{"group":{"start":39,"value":"40000"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":147,"pickleLine":141,"tags":["@smoke","@regression","@tax","@calculator-scss","@wip"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":148,"gherkinStepLine":142,"keywordType":"Context","textWithKeyword":"Given I open the SCSS calculator","stepMatchArguments":[]},{"pwStepLine":149,"gherkinStepLine":143,"keywordType":"Action","textWithKeyword":"When I request SCSS premature closure calculation","stepMatchArguments":[]},{"pwStepLine":150,"gherkinStepLine":144,"keywordType":"Outcome","textWithKeyword":"Then the SCSS premature closure feature should be marked not implemented","stepMatchArguments":[]}]},
]; // bdd-data-end