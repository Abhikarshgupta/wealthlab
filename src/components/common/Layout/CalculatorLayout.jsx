/**
 * CalculatorLayout - Responsive layout for calculator pages
 * Desktop: Side-by-side (inputs left, results right)
 * Mobile: Stacked (inputs top, results below)
 */
const CalculatorLayout = ({ 
  inputPanel, 
  resultsPanel, 
  infoPanel, 
  evolutionTable 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Desktop Layout: Side-by-side */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 mb-8">
        {/* Input Panel - Left */}
        <div className="card">
          {inputPanel}
        </div>
        
        {/* Results Panel - Right */}
        <div className="card">
          {resultsPanel}
        </div>
      </div>

      {/* Mobile Layout: Stacked */}
      <div className="lg:hidden space-y-6">
        {/* Input Panel - Top */}
        <div className="card">
          {inputPanel}
        </div>
        
        {/* Results Panel - One scroll below */}
        <div className="card">
          {resultsPanel}
        </div>
      </div>

      {/* Information Panel - Below (Both layouts) */}
      {infoPanel && (
        <div className="card mt-8">
          {infoPanel}
        </div>
      )}

      {/* Evolution Table - Below (Both layouts) */}
      {evolutionTable && (
        <div className="card mt-8">
          {evolutionTable}
        </div>
      )}
    </div>
  )
}

export default CalculatorLayout
