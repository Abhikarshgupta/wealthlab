# Decision Flowcharts & Product Thinking

This document showcases the decision-making process for key product features and technical implementations. These flowcharts demonstrate how product choices were made, what alternatives were considered, and how decisions impacted the final implementation.

---

## 1. FD Tenure Input Enhancement Decision Flow

**Problem**: FD calculator used radio buttons for "Years OR Months", limiting flexibility for scenarios like "1 year 3 months".

```mermaid
flowchart TD
    A[User Request: FD Tenure Input] --> B{Current Implementation}
    B --> C[Radio Buttons: Years OR Months]
    C --> D[Problem Identified]
    D --> E[Users need Years + Months]
    
    E --> F[Brainstorm Solutions]
    F --> G[Option 1: Keep Radio + Add Months Field]
    F --> H[Option 2: Separate Years + Months Inputs]
    F --> I[Option 3: Single Field with Years.Months]
    
    G --> J{Evaluation}
    H --> K{Evaluation}
    I --> L{Evaluation}
    
    J --> M[❌ Still Requires Radio Toggle]
    K --> N[✅ Most Intuitive]
    L --> O[❌ Decimal Input Confusing]
    
    M --> P[Decision: Option 2]
    N --> P
    O --> P
    
    P --> Q[Implementation Plan]
    Q --> R[Data Structure: tenureYears + tenureMonths]
    Q --> S[UI: Two Input Fields]
    Q --> T[Utility Functions: Convert/Normalize]
    Q --> U[Backward Compatibility: Legacy Support]
    
    R --> V[Implementation]
    S --> V
    T --> V
    U --> V
    
    V --> W[Outcome]
    W --> X[✅ Users can input 1 year 3 months]
    W --> Y[✅ Consistent across FD Calculator & Corpus Simulator]
    W --> Z[✅ Auto-normalization: 15 months → 1 year 3 months]
    W --> AA[✅ Backward compatible with legacy data]
```

**Key Decision Points**:
- **Why separate inputs?** Most intuitive and matches user mental model
- **Why auto-normalization?** Prevents confusion (15 months → 1 year 3 months)
- **Why backward compatibility?** Existing saved data continues to work

**Impact**: Improved user experience, accurate calculations, consistent UI across calculators.

---

## 2. Tax Calculation Accuracy Decision Flow

**Problem**: FD tax calculation used arbitrary 30% assumption, leading to incorrect "9% effective rate" mystery.

```mermaid
flowchart TD
    A[User Question: Why 9% Tax Rate?] --> B[Investigation]
    B --> C[Found: Arbitrary 30% Assumption]
    
    C --> D[Problem Analysis]
    D --> E[Current Logic: corpus × 0.3 × 0.3 = 9%]
    E --> F[Issue: Assumes 30% of corpus is interest]
    
    F --> G[Reality Check]
    G --> H[Interest varies by: Principal, Rate, Tenure]
    G --> I[Example: ₹1L @ 6.5% for 1yr → ~6.5% interest]
    G --> J[Example: ₹1L @ 6.5% for 10yr → ~46% interest]
    
    H --> K[Decision Needed]
    I --> K
    J --> K
    
    K --> L{Solution Options}
    L --> M[Option 1: Keep 30% Estimate]
    L --> N[Option 2: Calculate Actual Interest]
    L --> O[Option 3: User Input Interest]
    
    M --> P[❌ Inaccurate for Most Scenarios]
    N --> Q[✅ Accurate & Automatic]
    O --> R[❌ Adds User Friction]
    
    P --> S[Decision: Option 2]
    Q --> S
    R --> S
    
    S --> T[Implementation Strategy]
    T --> U[Priority 1: Use Returns Parameter]
    T --> V[Priority 2: Calculate: corpus - principal]
    T --> W[Priority 3: Fallback to Estimate]
    
    U --> X[Implementation]
    V --> X
    W --> X
    
    X --> Y[Additional Requirement]
    Y --> Z[User-Selectable Tax Bracket]
    Z --> AA[Why? FD interest taxed at user's bracket]
    
    AA --> AB[Implementation]
    AB --> AC[TaxBracketSelector Component]
    AB --> AD[Store: incomeTaxSlab]
    AB --> AE[Tax Calculation: Uses user's bracket]
    
    AC --> AF[Outcome]
    AD --> AF
    AE --> AF
    
    AF --> AG[✅ Accurate Tax Calculations]
    AF --> AH[✅ User Controls Their Tax Bracket]
    AF --> AI[✅ Clear Explanation: Tax Rate vs Effective Rate]
    AF --> AJ[✅ Works for All Scenarios]
```

**Key Decision Points**:
- **Why calculate actual interest?** Accuracy is critical for financial planning
- **Why priority-based fallback?** Robustness - handles edge cases gracefully
- **Why user-selectable tax bracket?** Tax depends on user's income, not instrument

**Impact**: Accurate tax calculations, user trust, educational clarity (tax rate vs effective rate).

---

## 3. Corpus Simulator Naming Decision Flow

**Problem**: Initially called "Corpus Calculator" but needed a name that better reflected its simulation capabilities.

```mermaid
flowchart TD
    A[Feature: Multi-Instrument Portfolio Tool] --> B[Initial Name: Corpus Calculator]
    B --> C[User Feedback]
    C --> D[What does it actually do?]
    
    D --> E[Analysis]
    E --> F[✅ Combines multiple instruments]
    E --> G[✅ Projects future corpus]
    E --> H[✅ Shows tax & inflation impact]
    E --> I[✅ Simulates different scenarios]
    
    F --> J[Brainstorming]
    G --> J
    H --> J
    I --> J
    
    J --> K{Name Options}
    K --> L[Option 1: Corpus Calculator]
    K --> M[Option 2: Corpus Simulator]
    K --> N[Option 3: Portfolio Projector]
    K --> O[Option 4: Wealth Simulator]
    
    L --> P[Evaluation]
    M --> Q[Evaluation]
    N --> R[Evaluation]
    O --> S[Evaluation]
    
    P --> T[❌ Implies Single Calculation]
    Q --> U[✅ Emphasizes Simulation/Projection]
    R --> V[❌ Too Generic]
    S --> W[❌ Too Broad]
    
    T --> X[Decision: Corpus Simulator]
    U --> X
    V --> X
    W --> X
    
    X --> Y[Rationale]
    Y --> Z[Calculator = One-time calculation]
    Y --> AA[Simulator = Multiple scenarios, projections]
    Y --> AB[Matches User Experience: Save/Load Scenarios]
    
    Z --> AC[Implementation]
    AA --> AC
    AB --> AC
    
    AC --> AD[UI Updates]
    AD --> AE[Page Title: Corpus Simulator]
    AD --> AF[Button: Simulate Corpus]
    AD --> AG[Navigation: Corpus Simulator]
    AD --> AH[Documentation: Updated]
    
    AE --> AI[Outcome]
    AF --> AI
    AG --> AI
    AH --> AI
    
    AI --> AJ[✅ Clearer Product Positioning]
    AI --> AK[✅ Better User Expectations]
    AI --> AL[✅ Reflects Actual Capabilities]
```

**Key Decision Points**:
- **Why "Simulator" over "Calculator"?** Emphasizes scenario modeling vs single calculation
- **Why not other names?** Simulator is specific, clear, and matches user behavior (save/load scenarios)

**Impact**: Better product positioning, clearer user expectations, matches actual functionality.

---

## 4. Overall Product Architecture Decision Flow

**High-level decisions that shaped the entire product**.

```mermaid
flowchart TD
    A[Product Vision: WealthLab] --> B[Core Question: What Architecture?]
    
    B --> C[Decision 1: Technology Stack]
    C --> D[React + Vite: Modern & Fast]
    C --> E[Why? Rapid development, great DX]
    
    D --> F[Decision 2: State Management]
    E --> F
    F --> G[Local State for Calculators]
    F --> H[Zustand for Complex Forms]
    
    G --> I[Why? Self-contained, no global state needed]
    H --> J[Why? Multi-step forms need persistence]
    
    I --> K[Decision 3: Form Management]
    J --> K
    K --> L[React Hook Form + Joi]
    K --> M[Why? Performance, validation, DX]
    
    L --> N[Decision 4: Calculation Approach]
    M --> N
    N --> O[Real-time via useEffect]
    N --> P[Why? No calculate buttons, instant feedback]
    
    O --> Q[Decision 5: Code Organization]
    P --> Q
    Q --> R[Modular: Each calculator independent]
    Q --> S[Common Components: Reusable]
    Q --> T[Utils: Centralized logic]
    
    R --> U[Impact]
    S --> U
    T --> U
    
    U --> V[✅ Scalable Architecture]
    U --> W[✅ Easy to Add Features]
    U --> X[✅ Consistent Patterns]
    U --> Y[✅ Production-Ready]
```

**Key Decision Points**:
- **Why React + Vite?** Modern, fast, great developer experience
- **Why local state for calculators?** Simpler, better performance, no unnecessary complexity
- **Why Zustand for complex forms?** Lightweight, perfect for multi-step forms
- **Why React Hook Form?** Performance (minimal re-renders), easy validation
- **Why real-time calculations?** Better UX, no friction

**Impact**: Scalable, maintainable, performant architecture that supports rapid feature development.

---

## 5. Tax Calculation Method Selection Flow

**Decision**: How to handle tax calculations (withdrawal vs accumulation vs both).

```mermaid
flowchart TD
    A[Tax Calculation Requirement] --> B[User Needs]
    B --> C[Understand Tax Impact]
    B --> D[Plan for Retirement]
    B --> E[Compare Scenarios]
    
    C --> F[Decision: Tax Methods]
    D --> F
    E --> F
    
    F --> G[Option 1: Withdrawal Only]
    F --> H[Option 2: Accumulation Only]
    F --> I[Option 3: Both Methods]
    
    G --> J[Evaluation]
    H --> K[Evaluation]
    I --> L[Evaluation]
    
    J --> M[✅ Most Realistic for Retirement]
    J --> N[❌ Doesn't Show Annual Tax]
    K --> O[✅ Shows Year-by-Year Impact]
    K --> P[❌ Less Realistic for Planning]
    L --> Q[✅ Best of Both Worlds]
    L --> R[❌ More Complex]
    
    M --> S[Decision: Option 3]
    N --> S
    O --> S
    P --> S
    Q --> S
    R --> S
    
    S --> T[Implementation]
    T --> U[Default: Withdrawal]
    T --> V[Option: Accumulation]
    T --> W[Option: Compare Both]
    
    U --> X[Outcome]
    V --> X
    W --> X
    
    X --> Y[✅ Users Choose Method]
    X --> Z[✅ Educational: Explains Each Approach]
    X --> AA[✅ Flexibility for Different Use Cases]
```

**Key Decision Points**:
- **Why default to withdrawal?** Most realistic for retirement planning
- **Why offer both?** Education - users learn different tax approaches
- **Why comparison mode?** Helps users understand trade-offs

**Impact**: Educational value, flexibility, better financial planning decisions.

---

## Summary: Decision-Making Principles

Throughout the development process, key principles guided decisions:

1. **User-Centric**: Every decision starts with user needs and use cases
2. **Accuracy First**: Financial calculations must be accurate (tax calculation fix)
3. **Intuitive UX**: Prefer natural, intuitive interfaces (years + months)
4. **Educational**: Help users understand financial concepts (tax methods, tax rates)
5. **Scalable**: Architecture decisions support future growth
6. **Practical**: Balance ideal solutions with implementation complexity

**These flowcharts demonstrate**:
- How problems were identified and analyzed
- What alternatives were considered
- Why specific solutions were chosen
- How decisions impacted the final product

These decisions shaped WealthLab into a powerful, accurate, and user-friendly financial planning tool.

