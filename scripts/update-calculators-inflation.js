/**
 * Script to batch update all calculator components to remove inflation toggle
 * and use global inflation state from userPreferencesStore
 * 
 * Run with: node scripts/update-calculators-inflation.js
 */

const fs = require('fs')
const path = require('path')

const calculators = [
  'RDCalculator',
  'POMISCalculator',
  'IPOCalculator',
  'ETFCalculator',
  'NPSCalculator',
  'NSCalculator',
  'ELSSCalculator',
  'DebtMutualFundCalculator',
  'SCSSCalculator',
  'SGBCalculator',
  'SSYCalculator',
  'REITsCalculator',
  '54ECBondsCalculator',
]

const basePath = path.join(__dirname, '..', 'src', 'components', 'calculators')

console.log('Updating calculators to use global inflation toggle...\n')

calculators.forEach((calcName) => {
  const calcPath = path.join(basePath, calcName)
  const hookFile = path.join(calcPath, `use${calcName}.js`)
  const componentFile = path.join(calcPath, `${calcName}.jsx`)
  const tableFile = path.join(calcPath, `${calcName}Table.jsx`)

  console.log(`Processing ${calcName}...`)

  // Update hook file
  if (fs.existsSync(hookFile)) {
    let content = fs.readFileSync(hookFile, 'utf8')
    
    // Remove adjustInflation from function parameters
    content = content.replace(
      /@param \{boolean\} adjustInflation - Whether to adjust for inflation\n/g,
      ''
    )
    content = content.replace(
      /,\s*adjustInflation\s*\)/g,
      ')'
    )
    content = content.replace(
      /\(([^)]+),\s*adjustInflation\s*\)/g,
      '($1)'
    )
    
    // Update to get adjustInflation from store
    if (content.includes('const { defaultInflationRate } = useUserPreferencesStore()')) {
      content = content.replace(
        /const \{ defaultInflationRate \} = useUserPreferencesStore\(\)/g,
        'const { defaultInflationRate, adjustInflation } = useUserPreferencesStore()'
      )
    } else if (content.includes('useUserPreferencesStore')) {
      // Add adjustInflation if store is already imported
      content = content.replace(
        /const \{ ([^}]+) \} = useUserPreferencesStore\(\)/g,
        (match, vars) => {
          if (!vars.includes('adjustInflation')) {
            return `const { ${vars}, adjustInflation } = useUserPreferencesStore()`
          }
          return match
        }
      )
    }

    fs.writeFileSync(hookFile, content)
    console.log(`  ✓ Updated ${path.basename(hookFile)}`)
  }

  // Update component file
  if (fs.existsSync(componentFile)) {
    let content = fs.readFileSync(componentFile, 'utf8')
    
    // Remove adjustInflation from defaultValues
    content = content.replace(/,\s*adjustInflation:\s*(false|true)\s*/g, '')
    
    // Remove adjustInflation from watch
    content = content.replace(/const adjustInflation = watch\(['"]adjustInflation['"]\)\s*\n/g, '')
    
    // Remove adjustInflation from hook call
    content = content.replace(/,\s*adjustInflation\s*\)/g, ')')
    
    // Remove ToggleSwitch import if not used elsewhere
    const toggleSwitchMatches = content.match(/ToggleSwitch/g)
    if (toggleSwitchMatches && toggleSwitchMatches.length === 1) {
      content = content.replace(/import ToggleSwitch from[^\n]+\n/g, '')
    }
    
    // Remove inflation toggle JSX
    content = content.replace(
      /\{\/\* Inflation Adjustment Toggle \*\/\s*<ToggleSwitch[^>]*>[\s\S]*?<\/ToggleSwitch>\s*\}/g,
      ''
    )
    
    // Update evolutionTable to pass tenure
    // This is more complex and may need manual review
    const evolutionTableMatch = content.match(/evolutionTable=\{\s*<(\w+)CalculatorTable[^>]*evolution=\{results\?\.evolution\}[^>]*\/>\s*\}/)
    if (evolutionTableMatch) {
      // Need to find tenure variable and add it
      // This part may need manual adjustment
    }

    fs.writeFileSync(componentFile, content)
    console.log(`  ✓ Updated ${path.basename(componentFile)}`)
  }

  // Update table file
  if (fs.existsSync(tableFile)) {
    let content = fs.readFileSync(tableFile, 'utf8')
    
    // Add tenure parameter
    content = content.replace(
      /@param \{Array\} evolution - Evolution data from use\w+Calculator hook\n/g,
      '@param {Array} evolution - Evolution data from use' + calcName + 'Calculator hook\n * @param {number} tenure - Investment tenure in years\n'
    )
    
    content = content.replace(
      /const \w+CalculatorTable = \(\{ evolution \}\)/g,
      `const ${calcName}Table = ({ evolution, tenure })`
    )
    
    // Add tenure prop to InvestmentTable
    content = content.replace(
      /<InvestmentTable\s+data=\{evolution\}\s+title="[^"]+"\s*\/>/g,
      (match) => {
        if (!match.includes('tenure=')) {
          return match.replace(' />', ' tenure={tenure} />')
        }
        return match
      }
    )

    fs.writeFileSync(tableFile, content)
    console.log(`  ✓ Updated ${path.basename(tableFile)}`)
  }

  console.log('')
})

console.log('Done! Please review the changes and test each calculator.')

