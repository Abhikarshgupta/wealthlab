// Generated from: features\calculators\sgb.feature
import { test } from "playwright-bdd";

test.describe('SGB Calculator', () => {

  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => { if (testInfo.error) return;
    await Given('the default tax slab is 30 percent', null, { page }); 
    await And('inflation adjustment is off', null, { page }); 
  });
  
  test('SGB-01 Calculator loads with documented default values', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, Then, And, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await Then('the SGB gold amount should be 10', null, { page }); 
    await And('the SGB tenure should be 8 years', null, { page }); 
    await And('the SGB gold appreciation rate should match the current SGB rate', null, { page }); 
    await And('the SGB results panel should be visible', null, { page }); 
  });

  test('SGB-02 Results update in real time without Calculate button', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I set SGB gold amount to 50', null, { page }); 
    await Then('the SGB maturity amount should update without clicking calculate', null, { page }); 
  });

  test('SGB-03 Results panel shows Money in Hand (post-tax)', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await Then('the SGB results panel should show money in hand', null, { page }); 
  });

  test('SGB-04 Tax breakdown visible with capital gains exempt rule', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I enter SGB inputs from golden "SGB-26"', null, { page }); 
    await Then('I should see the SGB tax breakdown section', null, { page }); 
    await And('the SGB tax rule should mention capital gains exempt', null, { page }); 
  });

  test('SGB-05 Inflation toggle affects spending power when ON', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await And('inflation adjustment is on', null, { page }); 
    await When('I enter SGB inputs from golden "SGB-14"', null, { page }); 
    await Then('the SGB spending power should be less than money in hand', null, { page }); 
  });

  test('SGB-06 Evolution table shows year-wise breakdown', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await Then('the SGB evolution table should show 8 year rows', null, { page }); 
  });

  test('SGB-07 Info panel shows fixed 2.5% rate and last updated', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, Then, And, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await Then('the SGB info panel should show fixed interest rate 2.5 percent', null, { page }); 
    await And('the SGB info panel should show last updated date', null, { page }); 
  });

  test('SGB-08 Invalid min gold amount shows inline validation error', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I set SGB gold amount to 0', null, { page }); 
    await Then('I should see SGB validation error containing "Minimum gold amount is"', null, { page }); 
  });

  test('SGB-09 Invalid max gold amount shows inline validation error', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I set SGB gold amount to 1001', null, { page }); 
    await Then('I should see SGB validation error containing "Maximum gold amount is"', null, { page }); 
  });

  test('SGB-10 Zero or empty input does not crash', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I clear SGB gold amount', null, { page }); 
    await Then('the SGB calculator should not crash', null, { page }); 
    await And('the SGB results panel should show empty state or validation', null, { page }); 
  });

  test('SGB-11 Negative input rejected or clamped', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I set SGB gold amount to -5', null, { page }); 
    await Then('I should see SGB validation error or clamped minimum value', null, { page }); 
  });

  test('SGB-12 Non-numeric input rejected', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I enter non-numeric SGB gold amount "abc"', null, { page }); 
    await Then('I should see SGB validation error or unchanged numeric value', null, { page }); 
  });

  test('SGB-13 Extremely large value handled without overflow', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I set SGB gold amount to 99999', null, { page }); 
    await Then('I should see SGB validation error containing "Maximum gold amount is"', null, { page }); 
  });

  test.describe('SGB-14 Golden calculation matches reference value', () => {

    test('Example #1', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('I open the SGB calculator', null, { page }); 
      await When('I enter SGB inputs from golden "SGB-14"', null, { page }); 
      await Then('the SGB money in hand should match golden "SGB-14" within tolerance', null, { page }); 
      await And('the SGB principal invested should match golden "SGB-14" within tolerance', null, { page }); 
    });

    test('Example #2', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('I open the SGB calculator', null, { page }); 
      await When('I enter SGB inputs from golden "SGB-14-5y"', null, { page }); 
      await Then('the SGB money in hand should match golden "SGB-14-5y" within tolerance', null, { page }); 
      await And('the SGB principal invested should match golden "SGB-14-5y" within tolerance', null, { page }); 
    });

  });

  test('SGB-15 Pie chart renders investment breakdown', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await Then('the SGB pie chart should render or show graceful fallback', null, { page }); 
  });

  test('SGB-20 Semi-annual 2.5% fixed interest component matches golden', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I enter SGB inputs from golden "SGB-20"', null, { page }); 
    await Then('the SGB fixed interest amount should match golden "SGB-20" within tolerance', null, { page }); 
  });

  test('SGB-21 Gold appreciation rate is user-adjustable', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I set SGB gold appreciation rate to 12', null, { page }); 
    await Then('the SGB money in hand should match golden "SGB-21" within tolerance', null, { page }); 
  });

  test('SGB-22 Real-time gold price fetch succeeds', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge', '@known-bug'] }, async ({ Given, When, Then, page }) => { 
    await Given('the SGB gold API returns price 7000 per gram', null, { page }); 
    await When('I navigate to the SGB calculator', null, { page }); 
    await Then('the SGB principal should reflect gold price 7000 per gram', null, { page }); 
  });

  test('SGB-23 Gold API failure uses fallback price', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('the SGB gold API fails', null, { page }); 
    await When('I navigate to the SGB calculator', null, { page }); 
    await Then('the SGB money in hand should match golden "SGB-23" within tolerance', null, { page }); 
  });

  test('SGB-25 Missing gold API key uses fallback price', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb', '@edge'] }, async ({ Given, When, Then, page }) => { 
    await Given('the SGB gold API has no key', null, { page }); 
    await When('I navigate to the SGB calculator', null, { page }); 
    await Then('the SGB money in hand should match golden "SGB-23" within tolerance', null, { page }); 
  });

  test('SGB-26 Maturity is tax-free — post-tax equals nominal', { tag: ['@smoke', '@regression', '@tax', '@calculator-sgb'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I open the SGB calculator', null, { page }); 
    await When('I enter SGB inputs from golden "SGB-26"', null, { page }); 
    await Then('the SGB money in hand should match golden "SGB-26" within tolerance', null, { page }); 
    await And('the SGB tax deducted should be zero', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\calculators\\sgb.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":11,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then the SGB gold amount should be 10","stepMatchArguments":[{"group":{"start":30,"value":"10"},"parameterTypeName":"int"}]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the SGB tenure should be 8 years","stepMatchArguments":[{"group":{"start":25,"value":"8"},"parameterTypeName":"int"}]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the SGB gold appreciation rate should match the current SGB rate","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the SGB results panel should be visible","stepMatchArguments":[]}]},
  {"pwTestLine":19,"pickleLine":19,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I set SGB gold amount to 50","stepMatchArguments":[{"group":{"start":25,"value":"50"},"parameterTypeName":"int"}]},{"pwStepLine":22,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then the SGB maturity amount should update without clicking calculate","stepMatchArguments":[]}]},
  {"pwTestLine":25,"pickleLine":25,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"Then the SGB results panel should show money in hand","stepMatchArguments":[]}]},
  {"pwTestLine":30,"pickleLine":30,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":31,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"When I enter SGB inputs from golden \"SGB-26\"","stepMatchArguments":[{"group":{"start":31,"value":"\"SGB-26\"","children":[{"start":32,"value":"SGB-26","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":33,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"Then I should see the SGB tax breakdown section","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"And the SGB tax rule should mention capital gains exempt","stepMatchArguments":[]}]},
  {"pwTestLine":37,"pickleLine":37,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":38,"gherkinStepLine":38,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":39,"gherkinStepLine":39,"keywordType":"Context","textWithKeyword":"And inflation adjustment is on","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Action","textWithKeyword":"When I enter SGB inputs from golden \"SGB-14\"","stepMatchArguments":[{"group":{"start":31,"value":"\"SGB-14\"","children":[{"start":32,"value":"SGB-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":41,"keywordType":"Outcome","textWithKeyword":"Then the SGB spending power should be less than money in hand","stepMatchArguments":[]}]},
  {"pwTestLine":44,"pickleLine":44,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":45,"gherkinStepLine":45,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"Then the SGB evolution table should show 8 year rows","stepMatchArguments":[{"group":{"start":36,"value":"8"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":49,"pickleLine":49,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":50,"gherkinStepLine":50,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":51,"gherkinStepLine":51,"keywordType":"Outcome","textWithKeyword":"Then the SGB info panel should show fixed interest rate 2.5 percent","stepMatchArguments":[]},{"pwStepLine":52,"gherkinStepLine":52,"keywordType":"Outcome","textWithKeyword":"And the SGB info panel should show last updated date","stepMatchArguments":[]}]},
  {"pwTestLine":55,"pickleLine":55,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":56,"gherkinStepLine":56,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":57,"gherkinStepLine":57,"keywordType":"Action","textWithKeyword":"When I set SGB gold amount to 0","stepMatchArguments":[{"group":{"start":25,"value":"0"},"parameterTypeName":"int"}]},{"pwStepLine":58,"gherkinStepLine":58,"keywordType":"Outcome","textWithKeyword":"Then I should see SGB validation error containing \"Minimum gold amount is\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Minimum gold amount is\"","children":[{"start":46,"value":"Minimum gold amount is","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":61,"pickleLine":61,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":62,"gherkinStepLine":62,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":63,"gherkinStepLine":63,"keywordType":"Action","textWithKeyword":"When I set SGB gold amount to 1001","stepMatchArguments":[{"group":{"start":25,"value":"1001"},"parameterTypeName":"int"}]},{"pwStepLine":64,"gherkinStepLine":64,"keywordType":"Outcome","textWithKeyword":"Then I should see SGB validation error containing \"Maximum gold amount is\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Maximum gold amount is\"","children":[{"start":46,"value":"Maximum gold amount is","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":67,"pickleLine":67,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":68,"gherkinStepLine":68,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":69,"gherkinStepLine":69,"keywordType":"Action","textWithKeyword":"When I clear SGB gold amount","stepMatchArguments":[]},{"pwStepLine":70,"gherkinStepLine":70,"keywordType":"Outcome","textWithKeyword":"Then the SGB calculator should not crash","stepMatchArguments":[]},{"pwStepLine":71,"gherkinStepLine":71,"keywordType":"Outcome","textWithKeyword":"And the SGB results panel should show empty state or validation","stepMatchArguments":[]}]},
  {"pwTestLine":74,"pickleLine":74,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":75,"gherkinStepLine":75,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":76,"gherkinStepLine":76,"keywordType":"Action","textWithKeyword":"When I set SGB gold amount to -5","stepMatchArguments":[{"group":{"start":25,"value":"-5"},"parameterTypeName":"int"}]},{"pwStepLine":77,"gherkinStepLine":77,"keywordType":"Outcome","textWithKeyword":"Then I should see SGB validation error or clamped minimum value","stepMatchArguments":[]}]},
  {"pwTestLine":80,"pickleLine":80,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":81,"gherkinStepLine":81,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":82,"gherkinStepLine":82,"keywordType":"Action","textWithKeyword":"When I enter non-numeric SGB gold amount \"abc\"","stepMatchArguments":[{"group":{"start":36,"value":"\"abc\"","children":[{"start":37,"value":"abc","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":83,"gherkinStepLine":83,"keywordType":"Outcome","textWithKeyword":"Then I should see SGB validation error or unchanged numeric value","stepMatchArguments":[]}]},
  {"pwTestLine":86,"pickleLine":86,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":87,"gherkinStepLine":87,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":88,"gherkinStepLine":88,"keywordType":"Action","textWithKeyword":"When I set SGB gold amount to 99999","stepMatchArguments":[{"group":{"start":25,"value":"99999"},"parameterTypeName":"int"}]},{"pwStepLine":89,"gherkinStepLine":89,"keywordType":"Outcome","textWithKeyword":"Then I should see SGB validation error containing \"Maximum gold amount is\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Maximum gold amount is\"","children":[{"start":46,"value":"Maximum gold amount is","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":94,"pickleLine":100,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":95,"gherkinStepLine":93,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":96,"gherkinStepLine":94,"keywordType":"Action","textWithKeyword":"When I enter SGB inputs from golden \"SGB-14\"","stepMatchArguments":[{"group":{"start":31,"value":"\"SGB-14\"","children":[{"start":32,"value":"SGB-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":97,"gherkinStepLine":95,"keywordType":"Outcome","textWithKeyword":"Then the SGB money in hand should match golden \"SGB-14\" within tolerance","stepMatchArguments":[{"group":{"start":42,"value":"\"SGB-14\"","children":[{"start":43,"value":"SGB-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":98,"gherkinStepLine":96,"keywordType":"Outcome","textWithKeyword":"And the SGB principal invested should match golden \"SGB-14\" within tolerance","stepMatchArguments":[{"group":{"start":47,"value":"\"SGB-14\"","children":[{"start":48,"value":"SGB-14","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":101,"pickleLine":101,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":102,"gherkinStepLine":93,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":103,"gherkinStepLine":94,"keywordType":"Action","textWithKeyword":"When I enter SGB inputs from golden \"SGB-14-5y\"","stepMatchArguments":[{"group":{"start":31,"value":"\"SGB-14-5y\"","children":[{"start":32,"value":"SGB-14-5y","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":104,"gherkinStepLine":95,"keywordType":"Outcome","textWithKeyword":"Then the SGB money in hand should match golden \"SGB-14-5y\" within tolerance","stepMatchArguments":[{"group":{"start":42,"value":"\"SGB-14-5y\"","children":[{"start":43,"value":"SGB-14-5y","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":105,"gherkinStepLine":96,"keywordType":"Outcome","textWithKeyword":"And the SGB principal invested should match golden \"SGB-14-5y\" within tolerance","stepMatchArguments":[{"group":{"start":47,"value":"\"SGB-14-5y\"","children":[{"start":48,"value":"SGB-14-5y","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":110,"pickleLine":104,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":111,"gherkinStepLine":105,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":112,"gherkinStepLine":106,"keywordType":"Outcome","textWithKeyword":"Then the SGB pie chart should render or show graceful fallback","stepMatchArguments":[]}]},
  {"pwTestLine":115,"pickleLine":109,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":116,"gherkinStepLine":110,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":117,"gherkinStepLine":111,"keywordType":"Action","textWithKeyword":"When I enter SGB inputs from golden \"SGB-20\"","stepMatchArguments":[{"group":{"start":31,"value":"\"SGB-20\"","children":[{"start":32,"value":"SGB-20","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":118,"gherkinStepLine":112,"keywordType":"Outcome","textWithKeyword":"Then the SGB fixed interest amount should match golden \"SGB-20\" within tolerance","stepMatchArguments":[{"group":{"start":50,"value":"\"SGB-20\"","children":[{"start":51,"value":"SGB-20","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":121,"pickleLine":115,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":122,"gherkinStepLine":116,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":123,"gherkinStepLine":117,"keywordType":"Action","textWithKeyword":"When I set SGB gold appreciation rate to 12","stepMatchArguments":[{"group":{"start":36,"value":"12"},"parameterTypeName":"int"}]},{"pwStepLine":124,"gherkinStepLine":118,"keywordType":"Outcome","textWithKeyword":"Then the SGB money in hand should match golden \"SGB-21\" within tolerance","stepMatchArguments":[{"group":{"start":42,"value":"\"SGB-21\"","children":[{"start":43,"value":"SGB-21","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":127,"pickleLine":121,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge","@known-bug"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":128,"gherkinStepLine":122,"keywordType":"Context","textWithKeyword":"Given the SGB gold API returns price 7000 per gram","stepMatchArguments":[{"group":{"start":31,"value":"7000"},"parameterTypeName":"int"}]},{"pwStepLine":129,"gherkinStepLine":123,"keywordType":"Action","textWithKeyword":"When I navigate to the SGB calculator","stepMatchArguments":[]},{"pwStepLine":130,"gherkinStepLine":124,"keywordType":"Outcome","textWithKeyword":"Then the SGB principal should reflect gold price 7000 per gram","stepMatchArguments":[{"group":{"start":44,"value":"7000"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":133,"pickleLine":127,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":134,"gherkinStepLine":128,"keywordType":"Context","textWithKeyword":"Given the SGB gold API fails","stepMatchArguments":[]},{"pwStepLine":135,"gherkinStepLine":129,"keywordType":"Action","textWithKeyword":"When I navigate to the SGB calculator","stepMatchArguments":[]},{"pwStepLine":136,"gherkinStepLine":130,"keywordType":"Outcome","textWithKeyword":"Then the SGB money in hand should match golden \"SGB-23\" within tolerance","stepMatchArguments":[{"group":{"start":42,"value":"\"SGB-23\"","children":[{"start":43,"value":"SGB-23","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":139,"pickleLine":133,"tags":["@smoke","@regression","@tax","@calculator-sgb","@edge"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":140,"gherkinStepLine":134,"keywordType":"Context","textWithKeyword":"Given the SGB gold API has no key","stepMatchArguments":[]},{"pwStepLine":141,"gherkinStepLine":135,"keywordType":"Action","textWithKeyword":"When I navigate to the SGB calculator","stepMatchArguments":[]},{"pwStepLine":142,"gherkinStepLine":136,"keywordType":"Outcome","textWithKeyword":"Then the SGB money in hand should match golden \"SGB-23\" within tolerance","stepMatchArguments":[{"group":{"start":42,"value":"\"SGB-23\"","children":[{"start":43,"value":"SGB-23","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":145,"pickleLine":139,"tags":["@smoke","@regression","@tax","@calculator-sgb"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the default tax slab is 30 percent","isBg":true,"stepMatchArguments":[{"group":{"start":24,"value":"30"},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And inflation adjustment is off","isBg":true,"stepMatchArguments":[]},{"pwStepLine":146,"gherkinStepLine":140,"keywordType":"Context","textWithKeyword":"Given I open the SGB calculator","stepMatchArguments":[]},{"pwStepLine":147,"gherkinStepLine":141,"keywordType":"Action","textWithKeyword":"When I enter SGB inputs from golden \"SGB-26\"","stepMatchArguments":[{"group":{"start":31,"value":"\"SGB-26\"","children":[{"start":32,"value":"SGB-26","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":148,"gherkinStepLine":142,"keywordType":"Outcome","textWithKeyword":"Then the SGB money in hand should match golden \"SGB-26\" within tolerance","stepMatchArguments":[{"group":{"start":42,"value":"\"SGB-26\"","children":[{"start":43,"value":"SGB-26","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":149,"gherkinStepLine":143,"keywordType":"Outcome","textWithKeyword":"And the SGB tax deducted should be zero","stepMatchArguments":[]}]},
]; // bdd-data-end