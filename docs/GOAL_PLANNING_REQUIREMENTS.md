# Goal Planning Feature - Requirements Analysis Document

**Document Purpose:** Deep dive analysis of Goal Planning requirements from FinTech Developer, Chartered Accountant (CA), and Product Manager perspectives.

**Last Updated:** December 2024

---

## Executive Summary

Goal Planning is a critical feature that bridges individual calculators with holistic financial planning. This document analyzes 12 key decision points, their interdependencies, and recommendations considering technical feasibility, financial accuracy, tax implications, and user experience.

---

## Educational UX Design Principles

### Core Philosophy

Goal Planning should be **both a calculator and a teacher**. The feature must educate users about financial planning concepts while guiding them through decision-making. Each question should build naturally from the previous one, creating a logical progression that builds financial literacy.

### Key Principles

#### 1. Progressive Disclosure
- **Key decisions** presented as primary steps/questions
- **Detailed configurations** available as expandable sections
- Each step reveals only what's necessary at that moment
- Advanced options accessible but not overwhelming

#### 2. Contextual Learning
- **Side panel** updates dynamically based on current step/question
- Information presented **when relevant**, not all at once
- Each question includes context about why it matters
- Examples specific to user's current selections

#### 3. Adaptive Educational Depth
- **Default**: Simple, clear explanations
- **On-demand**: Deeper educational content available via expandable sections
- **What/How/Why** structure for all educational content:
  - **What?** - Definition/Concept (simple explanation)
  - **How?** - Mechanism/Process (step-by-step)
  - **Why?** - Rationale/Impact (real-world implications)

#### 4. Impact Visualization
- **Real-time preview** panel showing how choices affect outcomes
- **Before/After comparisons** for key decisions
- Visual indicators (arrows, color coding) for changes
- **Desktop**: Side-by-side layout (form + impact preview)
- **Mobile**: Drawer/slide-out panel for impact preview

#### 5. Examples at Every Step
- Real-world scenarios illustrating concepts
- Multiple user personas (different income levels, ages, goals)
- Edge cases explained with examples
- Indian financial context (tax implications, instruments, regulations)

#### 6. Low Cognitive Load
- One primary decision per screen/section
- Related inputs grouped logically
- Clear visual hierarchy
- Natural language explanations
- No financial jargon without explanation

### Educational Content Format

All educational content follows this structure:

```markdown
### [Concept Name]

**What?**
- Brief definition (1-2 sentences)
- Simple explanation

**How?**
- Step-by-step mechanism
- Visual aids if needed

**Why?**
- Impact on goal achievement
- Real-world implications

**Example:**
- Scenario 1: [User persona A]
- Scenario 2: [User persona B]
- Edge case scenario

**Common Mistakes:**
- Mistake 1 and why it's wrong
- Mistake 2 and correction
```

---

## Question 1: Goal Types & Categorization

### Current Options
- a) Single generic goal
- b) Multiple predefined types with specific rules
- c) Generic goal with optional tagging

### Analysis

#### FinTech Developer Perspective
- **a) Single Generic Goal:**
  - Simplest implementation
  - One form, one calculation engine
  - Fastest to build
  - Limitation: Can't optimize for goal-specific rules (e.g., education goals might need different inflation rates)

- **b) Multiple Predefined Types:**
  - Requires goal type selector component
  - Each type may have different calculation rules
  - More complex state management
  - Allows optimization per goal type
  - Examples: Retirement (age-based, 40+ years), Child Education (specific inflation rates), Emergency Fund (low risk, short-term), House Purchase (real estate inflation), Vacation (short-term, flexible)

- **c) Generic with Tagging:**
  - Flexible user experience
  - Metadata-based approach
  - Can evolve without breaking changes
  - Requires tagging system design

#### Chartered Accountant Perspective
- **Tax Implications by Goal Type:**
  - **Retirement (NPS/PPF):** Section 80C, 80CCD(1B) benefits apply
  - **Child Education (SSY):** Section 80C, EEE tax status
  - **House Purchase:** No tax benefits for goal planning itself
  - **Emergency Fund:** Should be liquid, FD/SCSS suitable
  - Different goals have different tax efficiency needs

- **Regulatory Considerations:**
  - SSY requires girl child < 10 years
  - SCSS requires age 60+
  - NPS has age-based restrictions
  - Goal type can inform eligibility

#### Product Manager Perspective
- **User Mental Model:**
  - Users think in terms of specific goals
  - "I want to save for my child's education" vs "I want ₹50L"
  - Goal types provide context and guidance
  - Reduces cognitive load

- **Scalability:**
  - Start with 3-5 common goal types
  - Can add more later
  - Generic option always available as fallback

### Recommendation Matrix

| Aspect | Single Generic | Predefined Types | Generic + Tagging |
|--------|---------------|-------------------|-------------------|
| **Development Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **User Experience** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Financial Accuracy** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Tax Optimization** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Maintainability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Scalability** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Interdependencies
- **Affects Question 2:** Goal types may have inherent urgency
- **Affects Question 3:** Different goals may have different current savings allocation rules
- **Affects Question 4:** Tax considerations depend on goal type
- **Affects Question 11:** Different visualizations per goal type

### Recommended Approach
**Option B (Predefined Types) - Single Goal Focus**

**Decision Rationale:**
- **Single Goal Focus**: Users focus on one goal at a time to reduce cognitive load
- **Clubbing Everything Together**: Would increase cognitive load and make it difficult for end users
- **Multi-Goal Planning**: Reserved for future phase (Phase 2+)
- **Better User Experience**: One goal allows users to concentrate on specific financial planning without distractions

**Phase 1 MVP:**
- Retirement (age-based calculations)
- Child Education (SSY-specific recommendations)
- House Purchase (real estate inflation consideration)
- Generic Goal (catch-all)

**Phase 2 Enhancement:**
- Emergency Fund
- Vacation/Travel
- Marriage
- Custom goal types
- **Multi-Goal Planning**: Dashboard with multiple goals, priority ranking, resource allocation

**Rationale:**
- Provides structure while maintaining flexibility
- Allows goal-specific optimizations
- Better user guidance
- Reduced cognitive load (one goal at a time)
- Can start simple and expand to multi-goal later

### Educational Content Structure

#### What?
**Goal Types** categorize your financial objectives based on their nature, timeline, and financial characteristics. Different goals have different requirements for risk, timeline, and tax optimization.

#### How?
- Goal types are predefined categories (Retirement, Child Education, House Purchase, etc.)
- Each type has specific rules: inflation rates, recommended instruments, timeline flexibility
- System uses goal type to optimize calculations and recommendations

#### Why?
- **Tax Optimization**: Retirement goals benefit from Section 80C/80CCD instruments (PPF, NPS, ELSS)
- **Timeline Matching**: Education goals need fixed timelines; retirement can be flexible
- **Risk Alignment**: Emergency funds need low risk; retirement can take higher risk
- **Inflation Accuracy**: Education costs inflate at 8-10% vs general 6%

#### Example Scenarios

**Scenario 1: Retirement Goal**
- User: Age 30, wants to retire at 60
- Goal Type: Retirement
- System: Uses 6% inflation, 30-year timeline, recommends NPS/PPF/ELSS for tax benefits
- Expected Return: 10-12% (long-term, can take risk)

**Scenario 2: Child Education**
- User: Girl child age 5, wants ₹50L for college in 15 years
- Goal Type: Child Education
- System: Uses 8% inflation (education-specific), recommends SSY (if eligible), ELSS
- Expected Return: 12-14% (medium-term, balanced risk)

**Scenario 3: House Purchase**
- User: Age 35, wants ₹1Cr for house in 5 years
- Goal Type: House Purchase
- System: Uses 6% inflation, shorter timeline, recommends balanced approach
- Expected Return: 8-10% (short-term, lower risk)

#### Common Mistakes
- **Mistake**: Selecting "Generic" for retirement (misses tax benefits)
- **Correction**: Always select specific goal type if applicable
- **Mistake**: Using same inflation rate for all goals
- **Correction**: System adjusts automatically based on goal type

### Contextual Side Panel Content

**When User Selects Goal Type:**

**For Retirement:**
- **What?** Retirement planning builds wealth over 20-40 years
- **Why?** Long timeline allows higher risk = higher returns
- **Tax Benefits**: Section 80C (₹1.5L), Section 80CCD(1B) (₹50K additional for NPS)
- **Example**: "If you're 30 and invest ₹50K/month in NPS+ELSS, you'll have ₹5Cr+ at 60"
- **Common Mistake**: Waiting until 50 to start retirement planning

**For Child Education:**
- **What?** Education costs rise faster than general inflation
- **Why?** Education inflation is 8-10% vs general 6%
- **Tax Benefits**: SSY provides Section 80C + tax-free withdrawal
- **Example**: "₹50L needed in 15 years actually requires ₹20L today at 8% inflation"
- **Common Mistake**: Underestimating education inflation

**For House Purchase:**
- **What?** House purchase typically has shorter timeline (5-10 years)
- **Why?** Shorter timeline = lower risk tolerance = balanced allocation
- **Tax Benefits**: Limited (no specific tax-saving instruments)
- **Example**: "For ₹1Cr house in 5 years, you need ₹28K/month SIP at 10% returns"
- **Common Mistake**: Taking too much risk for short-term goal

### Impact Visualization Requirements

**Real-time Preview:**
- As user selects goal type, show:
  - Default inflation rate (e.g., "Education: 8%" vs "Retirement: 6%")
  - Recommended instruments (e.g., "SSY, ELSS" for education)
  - Expected timeline impact (e.g., "Retirement: Flexible timeline")

**Before/After Comparison:**
- Show impact of selecting different goal types:
  - "With Retirement goal: ₹5Cr corpus in 30 years"
  - "With Generic goal: ₹4.5Cr corpus (misses tax benefits)"

**Visual Indicators:**
- Color-coded badges for goal types
- Icons representing goal characteristics
- Tooltips showing key differences

### Mobile Considerations

- Goal type selection: Large, touch-friendly radio buttons or cards
- Side panel: Slide-out drawer on mobile
- Examples: Scrollable cards or accordion
- Impact preview: Collapsible section below form

### UX Implementation Notes

**Side Panel Content:**
- Updates when user hovers/selects goal type
- Shows "What/How/Why" for selected type
- Includes example calculation
- Lists common mistakes

**Impact Visualization:**
- Real-time preview updates as type changes
- Shows projected corpus difference
- Highlights tax benefits if applicable

**Examples:**
- 3-4 scenarios per goal type
- Different user personas (age, income levels)
- Indian context (tax slabs, instruments)

**Progressive Disclosure:**
- Primary: Goal type selector (radio buttons/cards)
- Secondary: Expandable "Learn More" for each type
- Advanced: Custom goal type option (if needed)

---

## Question 2: Goal Priority/Urgency

### Current Options
- a) User sets urgency (Low/Medium/High)
- b) Auto-determined from time horizon
- c) No urgency concept

### Analysis

#### FinTech Developer Perspective
- **a) User-Set Urgency:**
  - Additional input field
  - Can override time-based logic
  - May conflict with time horizon (user says urgent but 20-year horizon)

- **b) Auto-Determined:**
  - Algorithm: Short-term (< 3 years) = High urgency, Medium-term (3-10 years) = Medium, Long-term (> 10 years) = Low
  - Simpler UX
  - Less user control

- **c) No Urgency:**
  - Simplest implementation
  - Risk profile is primary driver

#### Chartered Accountant Perspective
- **Time-Based Urgency Logic:**
  - < 3 years: High urgency → Can't take high risk → Lower expected returns
  - 3-7 years: Medium urgency → Balanced approach
  - > 7 years: Low urgency → Can take higher risk → Higher expected returns

- **Goal Type + Time Horizon:**
  - Retirement at age 30 with 30-year horizon = Low urgency
  - Retirement at age 55 with 5-year horizon = High urgency
  - Child education starting in 15 years = Medium urgency

#### Product Manager Perspective
- **User Confusion Risk:**
  - If user selects "High urgency" but 20-year horizon, creates confusion
  - Auto-determination reduces cognitive load
  - But some users may want to override

- **Risk Profile vs Urgency:**
  - Urgency affects risk tolerance
  - High urgency = Lower risk tolerance
  - Should urgency influence risk profile, or vice versa?

### Interdependencies
- **Affects Question 6:** Risk profile calculation
- **Affects Question 9:** Urgency affects shortfall recommendations (urgent = can't extend timeline)

### Recommended Approach
**Option B (Auto-Determined) with Visual Indicator**

**Decision Rationale:**
- **Auto-Determination**: System automatically calculates urgency from timeline
- **Reduces Cognitive Load**: Users don't need to understand urgency levels
- **Prevents Errors**: Avoids conflicts between user-set urgency and timeline (e.g., "High urgency" for 20-year goal)
- **Financial Accuracy**: Urgency aligns with financial reality (short timeline = high urgency)
- **Manual Override**: Available in advanced settings for expert users who need it

**Algorithm:**
```
if (timeHorizon < 3 years) → High Urgency
else if (timeHorizon < 7 years) → Medium Urgency  
else → Low Urgency
```

**Display:**
- Show calculated urgency badge with color coding (Red=High, Yellow=Medium, Green=Low)
- Explain reasoning: "Your goal is 5 years away, so this is a medium-urgency goal"
- Allow manual override if needed (advanced users, in settings)

**Rationale:**
- Reduces user errors
- Aligns urgency with financial reality
- Can still allow override for edge cases
- Better user experience (less cognitive load)

### Educational Content Structure

#### What?
**Urgency** determines how quickly you need to achieve your goal and affects your risk tolerance. It's automatically calculated based on your time horizon.

#### How?
- System calculates urgency from timeline:
  - < 3 years = High urgency (can't take much risk)
  - 3-7 years = Medium urgency (balanced approach)
  - > 7 years = Low urgency (can take higher risk)
- Urgency affects recommended risk profile and investment strategy

#### Why?
- **High Urgency**: Short timeline means you can't recover from market downturns → Lower risk → Lower returns
- **Low Urgency**: Long timeline allows riding out market volatility → Higher risk → Higher returns
- **Example Impact**: ₹50L goal in 2 years requires ₹2L/month (high urgency, low risk). Same goal in 15 years requires ₹8K/month (low urgency, high risk)

#### Example Scenarios

**Scenario 1: High Urgency (2 years)**
- Goal: ₹50L for house down payment
- Timeline: 2 years
- Urgency: High
- Recommended: FD, Debt funds (7-8% returns)
- Risk: Low (can't afford volatility)

**Scenario 2: Medium Urgency (5 years)**
- Goal: ₹50L for child's education
- Timeline: 5 years
- Urgency: Medium
- Recommended: Balanced (60% equity, 40% debt)
- Risk: Medium (some volatility acceptable)

**Scenario 3: Low Urgency (20 years)**
- Goal: ₹5Cr for retirement
- Timeline: 20 years
- Urgency: Low
- Recommended: Equity-heavy (80% equity, 20% debt)
- Risk: High (time to recover from downturns)

#### Common Mistakes
- **Mistake**: Manually setting "High urgency" for 20-year retirement goal
- **Correction**: Let system auto-calculate; urgency should match timeline
- **Mistake**: Ignoring urgency and taking high risk for short-term goals
- **Correction**: High urgency = lower risk tolerance

### Contextual Side Panel Content

**When Timeline is Entered:**
- **What?** Urgency is calculated automatically from your timeline
- **How?** System uses time-based algorithm to determine urgency level
- **Why?** Urgency affects risk tolerance and investment recommendations
- **Impact**: Shows how urgency affects recommended risk profile
- **Example**: "With 5-year timeline, you have medium urgency. This means balanced risk (60% equity, 40% debt) is appropriate."

### Impact Visualization Requirements

- Show urgency badge with explanation as timeline changes
- Visual indicator: Color-coded urgency (Red=High, Yellow=Medium, Green=Low)
- Show impact on recommended risk profile when urgency changes
- Example: "Changing timeline from 2 to 10 years changes urgency from High to Low, allowing higher risk investments"

### Mobile Considerations

- Urgency badge displayed prominently above form
- Tooltip accessible via tap on mobile
- Impact preview in collapsible section

### UX Implementation Notes

- Show calculated urgency badge with explanation
- Explain reasoning: "Your goal is 5 years away, so this is a medium-urgency goal"
- Allow manual override in advanced settings (for expert users)
- Visual feedback when urgency changes based on timeline input

---

## Question 3: Current Savings Allocation

### Current Options
- a) Auto-allocate across instruments based on risk profile
- b) User specifies allocation percentages
- c) Assume savings already invested, only calculate future SIP needs

### Analysis

#### FinTech Developer Perspective
- **a) Auto-Allocate:**
  - Requires allocation algorithm
  - Complex calculation engine
  - Need to distribute across multiple instruments
  - Example: ₹5L current savings → 60% Equity (₹3L), 20% Debt (₹1L), 20% Safe (₹1L)

- **b) User-Specified:**
  - Maximum flexibility
  - Complex form with multiple inputs
  - User may not know optimal allocation
  - Accessibility concerns

- **c) Current Savings Separate:**
  - Simplest implementation
  - Just add current savings as lumpsum to future value
  - Missing opportunity for optimization

#### Chartered Accountant Perspective
- **Current Savings Reality:**
  - Most users have savings in FD, Savings Account, or PPF
  - Not optimally allocated
  - Goal planning should optimize allocation

- **Tax Efficiency:**
  - Moving savings from FD to PPF/ELSS provides tax benefits
  - Reallocation recommendations should consider tax implications
  - SCSS for senior citizens

- **Asset Allocation:**
  - Current savings should align with risk profile
  - But can't force user to reallocate immediately
  - Show "recommended allocation" vs "current allocation"

#### Product Manager Perspective
- **User Trust:**
  - Auto-allocation may seem too prescriptive
  - Users may not trust automatic allocation
  - Need transparency

- **Simplicity vs Control:**
  - Most users want simplicity
  - Power users want control
  - Progressive disclosure

### Interdependencies
- **Affects Question 6:** Risk profile drives allocation
- **Affects Question 7:** Affects recommendation granularity
- **Affects Question 9:** Current savings reduces required SIP

### Recommended Approach
**Two-Flow Approach: User Choice - Simple or Comprehensive**

**Decision Rationale:**
- **Flow 1 (Phase 1 MVP)**: Simple approach - fresh start, no current savings allocation
- **Flow 2 (Phase 2)**: Advanced approach - current savings allocation with auto-algorithm
- **User Choice**: Both flows remain available - users choose based on their needs
- **Cater to Different Users**: 
  - **Flow 1 Users**: Starting fresh, want to focus on future planning only
  - **Flow 2 Users**: Want re-allocation help and portfolio analysis
- **Offline Flexibility**: Flow 1 users can manage current savings allocation offline using individual calculators

**Flow 1: Fresh Start (Available in Phase 1 & Phase 2)**
- **Approach**: Assume savings already invested, only calculate future SIP needs
- **User Experience**: Simple, clean form without allocation complexity
- **Use Case**: 
  - Users starting fresh with goal planning
  - Users who want to focus on future planning without worrying about current savings optimization
  - Users who prefer to manage current savings separately using individual calculators
- **Implementation**: 
  - Toggle or radio button: "Start Fresh" or "I want to focus on future planning"
  - No current savings input fields
  - No allocation sliders or percentages
  - Only calculate required monthly SIP based on target corpus and timeline
  - Focus on future investment strategy

**Flow 2: Current Savings Allocation (Phase 2) - Option A**
- **Approach**: Auto-allocate across instruments based on risk profile
- **User Experience**: Advanced form with current savings input and auto-allocation
- **Use Case**: 
  - Users who want to optimize existing savings as part of goal planning
  - Users seeking re-allocation help
  - Users wanting portfolio analysis and recommendations
- **Implementation**:
  - Toggle or radio button: "Optimize Current Savings" or "Include existing savings"
  - Current savings input field
  - Auto-allocation algorithm based on risk profile
  - Visual breakdown (pie chart or bar chart)
  - Manual override available
  - Tax optimization recommendations
  - Portfolio analysis showing current vs recommended allocation

**UI Implementation:**

**Phase 1 MVP:**
```
┌─────────────────────────────┐
│ Goal Planning Form          │
├─────────────────────────────┤
│ Goal Type: [Selected]        │
│ Target Amount: [Input]       │
│ Timeline: [Input]            │
│ Risk Profile: [Selected]     │
│                             │
│ Current Savings Approach:   │
│ (○) Start Fresh             │ ← Selected by default
│ ( ) Optimize Savings        │ ← Disabled, "Coming Soon"
│                             │
│ Monthly SIP: [Calculate]    │
└─────────────────────────────┘
```

**Phase 2:**
```
┌─────────────────────────────┐
│ Goal Planning Form          │
├─────────────────────────────┤
│ Goal Type: [Selected]        │
│ Target Amount: [Input]       │
│ Timeline: [Input]            │
│ Risk Profile: [Selected]     │
│                             │
│ Current Savings Approach:   │
│ (○) Start Fresh             │ ← Active option
│ ( ) Optimize Savings        │ ← Active option
│                             │
│ [If "Optimize Savings" selected:]
│ Current Savings: [Input]   │
│ Allocation: [Auto/Manual]   │
│ [Visual Breakdown]          │
│                             │
│ Monthly SIP: [Calculate]    │
└─────────────────────────────┘
```

**User Choice Mechanism:**
- **Radio Buttons or Toggle**: "Start Fresh" vs "Optimize Current Savings"
- **Default**: "Start Fresh" (Flow 1) for simplicity
- **Visual Distinction**: Clear labels explaining each option
- **Help Text**: 
  - Flow 1: "Focus on future planning. Use individual calculators to optimize current savings separately."
  - Flow 2: "Get recommendations for optimizing your existing savings allocation based on your risk profile."

**Rationale:**
- **Flow 1 Benefits**:
  - Simplest implementation
  - Low cognitive load
  - Users can focus on future planning
  - Fastest to build and validate
  - Can use existing calculators for current savings separately
  - Appeals to users who want simplicity

- **Flow 2 Benefits**:
  - Comprehensive goal planning
  - Optimizes existing savings
  - More accurate recommendations
  - Better tax optimization
  - Portfolio analysis and re-allocation help
  - Appeals to users who want complete picture

- **Why Retain Both Flows**:
  - Different user needs (simple vs comprehensive)
  - User choice based on their situation
  - Starting fresh users vs users with existing savings
  - Flexibility: Users can switch between flows
  - Both flows serve different use cases permanently

---

## Question 4: Tax Considerations

### Current Options
- a) Show post-tax returns (assume user's tax slab)
- b) Show pre-tax returns only
- c) Show both pre-tax and post-tax with tax slab selector

### Analysis

#### FinTech Developer Perspective
- **a) Post-Tax Returns:**
  - Requires tax slab input
  - Complex calculation: Different instruments have different tax treatment
  - ELSS: Section 80C deduction + LTCG tax
  - PPF: Tax-free
  - FD: Taxable as per slab
  - NPS: Partial tax-free withdrawal

- **b) Pre-Tax Only:**
  - Simplest implementation
  - Matches current calculator implementations
  - Consistent with existing patterns

- **c) Both Pre-Tax and Post-Tax:**
  - Most comprehensive
  - Double the calculations
  - More complex UI

#### Chartered Accountant Perspective
- **Tax Efficiency is Critical:**
  - ₹1L invested in FD @ 7% for 10 years (30% tax slab) = ₹1.96L post-tax
  - ₹1L invested in PPF @ 7.1% for 10 years = ₹2.0L tax-free
  - Tax efficiency can make significant difference

- **Tax Slab Considerations:**
  - Users in 30% slab benefit more from tax-saving instruments
  - Users in 5% slab may prefer higher returns over tax savings
  - Should factor into recommendations

- **Regulatory Compliance:**
  - Need disclaimer: "This is not tax advice"
  - Should show tax benefits but not as primary driver
  - Comply with financial advisory regulations

#### Product Manager Perspective
- **User Mental Model:**
  - Users care about "money in hand" not gross returns
  - Post-tax returns are more meaningful
  - But tax slabs are sensitive information

- **Complexity Trade-off:**
  - Adding tax calculations increases complexity
  - May overwhelm users
  - But essential for accurate planning

### Interdependencies
- **Affects Question 1:** Goal types have different tax implications
- **Affects Question 7:** Tax efficiency affects recommendations
- **Affects Question 8:** Tax calculations need accurate inflation

### Recommended Approach
**Option C (Both Pre-Tax and Post-Tax) - Ideal, but Option B (Pre-Tax Only) for Phase 1 MVP**

**Decision Rationale:**
- **Ideal Approach**: Option C provides comprehensive tax-aware planning
- **Phase 1 MVP**: Start with Option B (Pre-Tax Only) to build POC faster
- **Future Enhancement**: Build tax implementation in Phase 2+
- **POC Focus**: Validate core goal planning functionality first, then add tax complexity

**Phase 1 MVP: Option B (Pre-Tax Only)**
- **Implementation**: 
  - Show pre-tax returns only
  - Matches current calculator implementations
  - Consistent with existing patterns
  - Simplest implementation for POC
- **Display**: 
  - Pre-tax corpus: ₹50L
  - No tax slab selector
  - No tax-adjusted calculations
- **Rationale**: 
  - Fastest to build and validate
  - Allows focus on core goal planning logic
  - Reduces complexity for initial POC
  - Can build tax implementation later

**Phase 2+: Option C (Both Pre-Tax and Post-Tax)**
- **Implementation**:
  1. **Default View:** Pre-tax returns (matches Phase 1)
  2. **Expandable Section:** "View Tax-Adjusted Returns"
  3. **Tax Slab Selector:** Dropdown (5%, 10%, 15%, 20%, 30%, New Regime)
  4. **Show Both:**
     - Pre-tax corpus: ₹50L
     - Post-tax corpus (30% slab): ₹47L
     - Tax saved: ₹3L

**Tax Calculation Logic (Phase 2+):**
- PPF/SSY: Fully tax-free (no adjustment)
- ELSS: Section 80C deduction + LTCG calculation
- FD: Interest taxable as per slab
- NPS: 60% tax-free, 40% taxable
- Equity: LTCG after 1 year

**Rationale:**
- **Phase 1**: Simplest implementation for POC validation
- **Phase 2+**: Adds tax accuracy for comprehensive planning
- **Progressive Enhancement**: Build core functionality first, add tax complexity later
- **User Benefit**: Users get working tool quickly, tax features added incrementally

---

## Question 5: Multiple Goals Support

### Current Options
- a) Single goal per session
- b) Multiple goals with priority ranking
- c) Start with single goal, add multi-goal later

### Analysis

#### FinTech Developer Perspective
- **a) Single Goal:**
  - Simplest implementation
  - One form, one calculation
  - State management straightforward
  - User can plan multiple goals separately

- **b) Multiple Goals:**
  - Complex state management
  - Need goal list management
  - Resource allocation across goals
  - Priority-based SIP distribution
  - Example: ₹50K/month SIP → 60% Retirement, 40% Child Education

- **c) Start Single, Add Later:**
  - Phased approach
  - Can validate single goal first
  - Technical debt: Need to refactor for multi-goal

#### Chartered Accountant Perspective
- **Financial Reality:**
  - Users have multiple goals simultaneously
  - Need to prioritize and allocate resources
  - Different goals have different timelines and risk profiles
  - Holistic planning is more accurate

- **Resource Constraints:**
  - Limited SIP capacity
  - Need to balance multiple goals
  - Priority-based allocation is realistic

#### Product Manager Perspective
- **User Journey:**
  - Users don't plan in isolation
  - "I need to save for retirement AND child education"
  - Single goal feels incomplete
  - Multi-goal feels more powerful

- **Complexity Management:**
  - Multi-goal adds complexity
  - But addresses real user needs
  - Can start simple and expand

### Interdependencies
- **Affects Question 1:** Goal types become more important with multiple goals
- **Affects Question 2:** Priority ranking replaces urgency
- **Affects Question 9:** Shortfall recommendations need to consider all goals

### Recommended Approach
**Option A (Single Goal Per Session) - POC Focus**

**Decision Rationale:**
- **POC Approach**: Building proof of concept, will improve in future
- **Single Goal Focus**: One goal at a time reduces cognitive load
- **Simplicity**: Simplest implementation for initial validation
- **Future Enhancement**: Multi-goal support can be added later based on learnings

**Phase 1 MVP: Single Goal Per Session**
- **Implementation**:
  - One form, one calculation
  - State management straightforward
  - User can plan multiple goals separately (create multiple goal plans)
  - Each goal plan saved independently in localStorage
- **User Experience**:
  - User creates one goal plan per session
  - Can create multiple goal plans over time (via Goal History)
  - Each goal plan is independent
  - No cross-goal resource allocation in Phase 1
- **Rationale**:
  - Simplest implementation for POC
  - Allows validation of core functionality
  - Reduces complexity and cognitive load
  - Users can plan multiple goals by creating separate goal plans
  - Will improve and add multi-goal features in future phases

**Future Enhancement (Phase 2+): Multi-Goal Support**
- Multiple goals dashboard
- Priority ranking
- Resource allocation algorithm
- "SIP capacity: ₹50K/month → Allocate across goals"
- Cross-goal optimization

**Technical Note:**
- Code structure should remain extensible
- State management can be designed to support future multi-goal features
- Current single-goal approach doesn't prevent future multi-goal addition

---

## Question 6: Risk Profile Calculation

### Current Options
- a) User self-selects (Low/Medium/High/Very High)
- b) Questionnaire-based assessment
- c) Both options available

### Analysis

#### FinTech Developer Perspective
- **a) Self-Selection:**
  - Simple dropdown/radio buttons
  - Quick implementation
  - User may not understand risk levels

- **b) Questionnaire-Based:**
  - More accurate assessment
  - Questions: Age, income stability, investment experience, time horizon
  - Requires scoring algorithm
  - Example: Age 25 + High income + Experience = High Risk

- **c) Both Options:**
  - Maximum flexibility
  - More complex UI
  - "Quick Mode" vs "Detailed Assessment"

#### Chartered Accountant Perspective
- **Regulatory Compliance:**
  - SEBI requires risk profiling for investment advice
  - Questionnaire-based is industry standard
  - Self-selection may not meet compliance requirements
  - Need to capture: Age, income, experience, time horizon, risk capacity

- **Risk Assessment Factors:**
  - Age: Younger = Higher risk capacity
  - Income stability: Stable = Higher risk capacity
  - Experience: Experienced = Higher risk tolerance
  - Dependents: More dependents = Lower risk capacity
  - Existing assets: Higher assets = Higher risk capacity

#### Product Manager Perspective
- **User Experience:**
  - Questionnaire may feel tedious
  - But provides better guidance
  - Self-selection faster but less accurate
  - Need to balance speed vs accuracy

- **Trust Building:**
  - Questionnaire shows professionalism
  - More thorough assessment builds trust
  - But may scare away casual users

### Interdependencies
- **Affects Question 2:** Risk profile affects urgency interpretation
- **Affects Question 3:** Risk profile drives allocation
- **Affects Question 7:** Risk profile determines recommendations

### Recommended Approach
**Option C (Both Options) with Smart Defaults**

**Implementation:**
1. **Quick Mode (Default):**
   - Simple dropdown: Low/Medium/High/Very High
   - With brief descriptions
   - Suitable for casual users

2. **Detailed Assessment (Optional):**
   - 5-7 question questionnaire
   - Calculates risk score
   - Pre-fills dropdown
   - User can override

**Questionnaire Questions:**
1. Age: < 30 / 30-45 / 45-60 / > 60
2. Investment Experience: None / 1-3 years / 3-5 years / 5+ years
3. Income Stability: Unstable / Somewhat Stable / Very Stable
4. Dependents: None / 1-2 / 3+
5. Existing Investments: None / Only Safe / Mix / Mostly Equity
6. Risk Capacity: Can't afford losses / Some losses OK / High risk OK
7. Time Horizon: < 3 years / 3-7 years / 7-15 years / > 15 years

**Scoring Algorithm:**
- Each answer contributes to risk score
- Age: Inverse relationship (younger = higher score)
- Experience: Direct relationship
- Income stability: Direct relationship
- Dependents: Inverse relationship
- Score → Risk Profile mapping

**Rationale:**
- Provides flexibility
- Questionnaire for accuracy
- Self-selection for speed
- Industry-standard approach

---

## Question 7: Recommendation Granularity

### Current Options
- a) High-level instrument allocation only
- b) Specific instrument recommendations with amounts
- c) Multiple scenarios with different strategies

### Analysis

#### FinTech Developer Perspective
- **a) High-Level Only:**
  - Simple to implement
  - "60% Equity, 20% Debt, 20% Safe"
  - Less actionable

- **b) Specific Recommendations:**
  - More complex
  - "₹15,000/month in ELSS SIP, ₹5,000/month in PPF, ₹10,000/month in NPS"
  - Requires detailed allocation algorithm
  - More actionable

- **c) Multiple Scenarios:**
  - Most complex
  - Conservative, Balanced, Aggressive scenarios
  - Comparison view
  - Maximum flexibility

#### Chartered Accountant Perspective
- **Actionability:**
  - Users need specific recommendations
  - "60% Equity" is vague
  - "₹15K in ELSS" is actionable
  - Specific recommendations enable execution

- **Tax Optimization:**
  - Specific instruments allow tax optimization
  - ELSS for Section 80C
  - PPF for tax-free returns
  - NPS for additional deduction

- **Regulatory Compliance:**
  - Need disclaimers: "Not investment advice"
  - Should show rationale
  - Avoid recommending specific mutual funds

#### Product Manager Perspective
- **User Mental Model:**
  - Users think in terms of specific actions
  - "What should I do?" not "What's the allocation?"
  - Specific recommendations are more valuable
  - But may feel prescriptive

- **Trust & Transparency:**
  - Show why specific instruments
  - "ELSS recommended for tax benefits + equity exposure"
  - Build trust through transparency

### Interdependencies
- **Affects Question 1:** Goal types inform specific recommendations
- **Affects Question 3:** Current savings affects recommendations
- **Affects Question 4:** Tax considerations drive recommendations

### Recommended Approach
**Option B (Specific Recommendations) with Option C (Multiple Scenarios)**

**Implementation:**

**Primary Recommendation:**
```
Based on your risk profile (High Risk), here's your recommended plan:

Monthly SIP Breakdown:
├─ ELSS SIP: ₹15,000/month
│  └─ Expected Return: 14% | Tax Benefit: ₹45,000/year
├─ Equity Mutual Funds: ₹10,000/month  
│  └─ Expected Return: 12%
├─ PPF: ₹5,000/month (Annual: ₹60,000)
│  └─ Expected Return: 7.1% | Tax-Free
└─ NPS: ₹10,000/month
   └─ Expected Return: 10% | Additional Tax Benefit: ₹1.2L/year

One-Time Investment:
└─ Current Savings Allocation:
   ├─ Move ₹3L from FD to Equity Mutual Funds
   ├─ Move ₹1L to PPF (tax benefits)
   └─ Keep ₹1L in FD (emergency)
```

**Alternative Scenarios (Expandable):**
- Conservative Strategy: Lower risk, lower returns
- Aggressive Strategy: Higher risk, higher returns
- Tax-Optimized Strategy: Maximum tax benefits

**Rationale:**
- Provides actionable recommendations
- Shows multiple options
- Balances guidance with flexibility
- Tax-aware recommendations

---

## Question 8: Inflation Input

### Current Options
- a) Fixed at 6% (RBI benchmark)
- b) User-configurable (default 6%)
- c) Pull from user preferences store

### Analysis

#### FinTech Developer Perspective
- **a) Fixed 6%:**
  - Simplest implementation
  - Consistent across all calculations
  - No user input needed

- **b) User-Configurable:**
  - Additional input field
  - User may not understand inflation impact
  - Need validation (reasonable range: 3-10%)

- **c) User Preferences Store:**
  - Consistent across app
  - Already exists in codebase
  - Can be set once, used everywhere

#### Chartered Accountant Perspective
- **Historical Inflation:**
  - India: 4-6% average (last 10 years)
  - Education inflation: 8-10% (higher than general)
  - Healthcare inflation: 6-8%
  - Real estate: Varies by location
  - Goal-specific inflation may differ

- **Accuracy:**
  - Fixed 6% is reasonable default
  - But education goals need higher inflation
  - Healthcare goals need specific inflation
  - Generic goals: 6% is fine

#### Product Manager Perspective
- **User Understanding:**
  - Most users don't understand inflation
  - Configurable may confuse
  - But power users want control
  - Default should be sensible

- **Consistency:**
  - Should match calculator implementations
  - If calculators allow inflation adjustment, goal planning should too
  - User preferences store provides consistency

### Interdependencies
- **Affects Question 1:** Goal types may have different inflation rates
- **Affects Question 11:** Inflation affects visualization

### Recommended Approach
**Option C (User Preferences Store) with Goal-Type Overrides**

**Implementation:**
1. Default inflation: 6% (from userPreferencesStore)
2. Goal-type overrides:
   - Child Education: 8% (higher education inflation)
   - Healthcare: 7%
   - Generic: 6% (from preferences)
3. User can override if needed (advanced setting)

**Display:**
```
Inflation Rate: 6% (Default)
For Child Education goals, we use 8% inflation rate
[Customize]
```

**Rationale:**
- Consistent with existing calculators
- Goal-specific accuracy
- Flexible but not overwhelming
- Uses existing infrastructure

---

## Question 9: Shortfall Recommendations

### Current Options
- a) Increase SIP amount (most common)
- b) Show all options: increase SIP, add lumpsum, extend timeline, increase risk
- c) Show prioritized list based on feasibility

### Analysis

#### FinTech Developer Perspective
- **a) Increase SIP Only:**
  - Simplest implementation
  - Single recommendation
  - May not be feasible for user

- **b) All Options:**
  - Comprehensive
  - Multiple calculations
  - May overwhelm user

- **c) Prioritized List:**
  - Smart algorithm
  - Feasibility scoring
  - Most actionable first

#### Chartered Accountant Perspective
- **Feasibility Analysis:**
  - Increase SIP: Most common, but may exceed income
  - Add lumpsum: One-time, but may not have funds
  - Extend timeline: Feasible if goal is flexible
  - Increase risk: May not align with risk profile

- **Goal Flexibility:**
  - Retirement: Can extend timeline
  - Child Education: Timeline fixed, can't extend
  - House Purchase: Can extend timeline
  - Need to consider goal constraints

#### Product Manager Perspective
- **User Actionability:**
  - Users need actionable options
  - Prioritized list is helpful
  - But too many options may confuse
  - 3-4 options ideal

- **Presentation:**
  - Show impact of each option
  - "Increase SIP by ₹5K/month → Achieves goal"
  - "Extend timeline by 2 years → Achieves goal"
  - Visual comparison

### Interdependencies
- **Affects Question 2:** Urgency affects which options are feasible
- **Affects Question 5:** Multiple goals affect shortfall recommendations

### Recommended Approach
**Option C (Prioritized List) with Feasibility Scoring**

**Implementation:**

**Shortfall Detection:**
```
Target Corpus: ₹50L
Projected Corpus: ₹35L
Shortfall: ₹15L
```

**Recommendations (Prioritized):**

1. **Increase Monthly SIP** (Most Feasible)
   - Current: ₹20K/month
   - Required: ₹28K/month (+₹8K)
   - Impact: Achieves goal in 10 years
   - [Apply This]

2. **Extend Timeline** (If Goal is Flexible)
   - Current: 10 years
   - Required: 12 years (+2 years)
   - Impact: Achieves goal with current SIP
   - [Apply This]

3. **Add One-Time Lumpsum** (If Available)
   - Required: ₹5L lumpsum now
   - Impact: Reduces required SIP to ₹25K/month
   - [Apply This]

4. **Consider Higher Risk** (Last Resort)
   - Current: Medium Risk (10% returns)
   - Required: High Risk (12% returns)
   - Impact: Achieves goal with current SIP
   - ⚠️ Warning: Higher risk = Higher volatility
   - [Learn More]

**Feasibility Scoring:**
- Increase SIP: Score based on income percentage
- Extend timeline: Score based on goal flexibility
- Add lumpsum: Score based on current savings
- Increase risk: Low score (last resort)

**Rationale:**
- Provides actionable options
- Prioritized by feasibility
- Considers goal constraints
- Visual impact comparison

---

## Question 10: Step-Up SIP in Goal Planning

### Current Options
- a) Yes, allow users to set annual step-up percentage
- b) No, keep it simple with fixed SIP
- c) Optional, with explanation of benefits

### Analysis

#### FinTech Developer Perspective
- **a) Include Step-Up:**
  - Reuses existing step-up calculation
  - More complex form
  - More accurate projections

- **b) Fixed SIP:**
  - Simplest implementation
  - Less accurate (people's income increases)
  - Faster to build

- **c) Optional:**
  - Balanced approach
  - Progressive disclosure
  - Default: Disabled

#### Chartered Accountant Perspective
- **Real-World Reality:**
  - Salaries typically increase 5-10% annually
  - Step-up SIP reflects reality
  - More accurate projections
  - Helps achieve goals faster

- **Tax Efficiency:**
  - Step-up SIP in ELSS increases tax benefits over time
  - More tax savings as income increases

#### Product Manager Perspective
- **User Education:**
  - Most users don't know about step-up SIP
  - Opportunity to educate
  - But may add complexity

- **Default Behavior:**
  - Default: Disabled (simpler)
  - Optional: Enabled (more accurate)
  - Explain benefits when enabled

### Interdependencies
- **Affects Question 9:** Step-up affects shortfall calculations

### Recommended Approach
**Option C (Optional) with Smart Defaults**

**Implementation:**

**Default View:**
```
Monthly SIP: ₹20,000
[ ] Enable Step-Up SIP (Recommended)
```

**When Enabled:**
```
Monthly SIP: ₹20,000
[✓] Enable Step-Up SIP (Recommended)

Annual Step-Up: 10% (Default)
├─ Year 1: ₹20,000/month
├─ Year 2: ₹22,000/month
├─ Year 3: ₹24,200/month
└─ ...

💡 Benefit: Step-up SIP helps you keep pace with inflation and salary increases, making it easier to achieve your goal.
```

**Benefits Display:**
- Without step-up: ₹50L corpus
- With 10% step-up: ₹65L corpus (+₹15L)
- Helps achieve goal faster

**Rationale:**
- Keeps default simple
- Provides advanced option
- Educates users
- More accurate projections

---

## Question 11: Visualization Requirements

### Current Options
- a) Results cards + pie chart + recommendations table
- b) All of the above + projection graph showing corpus growth over time
- c) All of the above + comparison with inflation-adjusted target

### Analysis

#### FinTech Developer Perspective
- **a) Basic Visualization:**
  - Reuses existing components
  - PieChart component available
  - ResultCard component available
  - Fastest implementation

- **b) With Projection Graph:**
  - Need new chart component
  - Line chart showing growth over time
  - More engaging
  - Shows progress visualization

- **c) With Inflation Comparison:**
  - Most comprehensive
  - Dual-axis chart (nominal vs real)
  - Shows purchasing power
  - Most informative

#### Chartered Accountant Perspective
- **Financial Accuracy:**
  - Nominal vs real values are critical
  - Users need to understand purchasing power
  - Inflation-adjusted comparison is essential
  - Shows true value of goal

#### Product Manager Perspective
- **User Engagement:**
  - Visualizations increase engagement
  - Charts are more memorable than numbers
  - Projection graph shows "journey"
  - Comparison chart shows "reality"

- **Information Hierarchy:**
  - Results cards: Key metrics
  - Pie chart: Allocation breakdown
  - Projection graph: Growth over time
  - Comparison chart: Real vs nominal

### Interdependencies
- **Affects Question 4:** Tax considerations affect visualization
- **Affects Question 8:** Inflation affects comparison chart

### Recommended Approach
**Option C (All Visualizations) with Progressive Disclosure**

**Implementation:**

**Default View:**
1. Results Cards (Top)
   - Target Corpus: ₹50L
   - Projected Corpus: ₹35L
   - Shortfall: ₹15L
   - Monthly SIP Required: ₹28K

2. Pie Chart (Allocation)
   - Equity: 60%
   - Debt: 20%
   - Safe: 20%

3. Recommendations Table
   - Instrument breakdown

**Expandable Sections:**

4. **Projection Graph** (Expandable)
   - Line chart: Corpus growth over time
   - Shows: Invested amount vs Returns vs Total corpus
   - X-axis: Years (0 to goal year)
   - Y-axis: Amount (₹)

5. **Inflation Comparison** (Expandable)
   - Dual visualization:
     - Nominal corpus: ₹50L
     - Real corpus (in today's value): ₹35L
   - Shows purchasing power erosion
   - Visual indicator: "Your ₹50L goal will have ₹35L purchasing power"

**Rationale:**
- Provides comprehensive view
- Progressive disclosure maintains simplicity
- Shows both nominal and real values
- Engages users visually

### Educational Visualizations

**Annotated Charts:**
- Each chart element includes tooltips explaining what it represents
- Hover/tap on chart elements shows:
  - What does this metric mean?
  - How is it calculated?
  - Why does it matter for your goal?

**Interactive Tooltips:**
- **Results Cards:**
  - Target Corpus: "This is your goal amount in future value"
  - Projected Corpus: "This is what you'll accumulate based on your inputs"
  - Shortfall: "The gap between target and projected corpus"
  - Monthly SIP Required: "How much you need to invest monthly"

- **Pie Chart (Allocation):**
  - Each segment shows: Instrument name, Percentage, Amount, Expected Return
  - Tooltip: "Why this allocation? [Risk profile explanation]"

- **Projection Graph:**
  - Multiple lines: Invested Amount, Returns, Total Corpus
  - Annotations at key points: "Year 5: Your investments start compounding significantly"
  - Interactive: Hover shows exact values at each year

- **Inflation Comparison:**
  - Dual visualization: Nominal vs Real value
  - Explanation: "Your ₹50L goal will have ₹35L purchasing power (in today's value)"
  - Visual indicator showing purchasing power erosion

**Comparison Modes:**
- **Pre-tax vs Post-tax Comparison:**
  - Toggle to switch views
  - Side-by-side cards showing difference
  - Explanation: "Post-tax corpus shows what you'll actually receive"

- **With/Without Step-up SIP:**
  - Slider to compare scenarios
  - Visual difference: "With 10% step-up: ₹65L vs Without: ₹50L"
  - Explanation: "Step-up SIP helps you keep pace with salary increases"

- **Risk Profile Comparison:**
  - Compare different risk profiles side-by-side
  - Shows: Expected returns, Volatility, Recommended allocation
  - Educational: "Higher risk = Higher returns but more volatility"

**Impact Comparison Views:**
- **Before/After Scenarios:**
  - Side-by-side comparison when user changes inputs
  - Visual indicators: ↑ (increase), ↓ (decrease), → (no change)
  - Color coding: Green (positive impact), Red (negative impact)

- **Scenario Slider:**
  - Interactive slider to adjust key inputs
  - Real-time updates showing impact
  - Example: "Adjust timeline slider to see impact on required SIP"

### Educational Visualization Requirements

**Results Cards:**
- Each card includes:
  - Large number (primary metric)
  - Label (what it represents)
  - Info icon (ℹ️) linking to explanation
  - Visual indicator (progress bar, trend arrow)

**Pie Chart:**
- Segments show:
  - Color-coded by instrument type
  - Percentage and amount labels
  - Hover/tap shows detailed breakdown
  - Legend with explanations

**Projection Graph:**
- Annotated with:
  - Key milestones (e.g., "Year 10: Your corpus doubles")
  - Educational markers (e.g., "Compounding effect visible here")
  - Interactive tooltips at each data point

**Inflation Comparison:**
- Visual representation:
  - Two bars: Nominal vs Real value
  - Percentage difference highlighted
  - Explanation: "Inflation reduces purchasing power by X%"

### Mobile Considerations

- Charts responsive: Stack vertically on mobile
- Tooltips: Tap to show, tap outside to dismiss
- Comparison views: Swipeable cards or tabs
- Projection graph: Horizontal scroll on mobile
- Impact preview: Collapsible section or drawer

### UX Implementation Notes

**Educational Visualizations:**
- All charts include "What does this mean?" explanations
- Interactive elements encourage exploration
- Progressive disclosure: Basic view first, expandable details

**Impact Comparison:**
- Side-by-side layout on desktop
- Drawer/modal on mobile
- Clear visual indicators for changes
- Smooth animations for transitions

**Progressive Disclosure:**
- Default view: Essential metrics only
- Expandable: Detailed charts and comparisons
- Advanced: Deep dive into calculations

---

## Question 12: Edge Case - Unrealistic Goals

### Current Options
- a) Show warning but allow calculation
- b) Auto-suggest alternative: extend timeline or reduce target
- c) Prevent submission with clear error message

### Analysis

#### FinTech Developer Perspective
- **a) Warning Only:**
  - Simplest validation
  - User can proceed
  - May lead to unrealistic expectations

- **b) Auto-Suggest:**
  - Smart algorithm
   - "Required SIP: ₹5L/month exceeds reasonable limit"
   - "Suggested: Extend timeline to 15 years or reduce target to ₹30L"
   - More helpful

- **c) Prevent Submission:**
   - Strict validation
   - May frustrate users
   - But prevents bad data

#### Chartered Accountant Perspective
- **Reasonable Limits:**
  - SIP typically 20-40% of income
   - If income is ₹1L/month, max reasonable SIP: ₹40K/month
   - Need to validate against income (if provided)
   - Or use general heuristics

- **Goal Achievability:**
  - Unrealistic goals lead to frustration
   - Better to guide users to achievable goals
   - But shouldn't be too restrictive

#### Product Manager Perspective
- **User Experience:**
  - Preventing submission may frustrate
   - Warning is gentler
   - Auto-suggest is helpful
   - Need to balance guidance with freedom

- **Validation Thresholds:**
  - What's "unrealistic"?
   - SIP > ₹2L/month? (depends on income)
   - Required SIP > 50% of income? (if income provided)
   - Timeline < 1 year for large goals?

### Interdependencies
- **Affects Question 9:** Shortfall recommendations need to handle unrealistic scenarios

### Recommended Approach
**Option B (Auto-Suggest) with Option A (Warning)**

**Implementation:**

**Validation Logic:**
```
if (requiredSIP > 200000) { // ₹2L/month
  // Unrealistic threshold
  showWarning = true
  suggestions = calculateAlternatives()
}

if (requiredSIP > currentSIP * 5) { // 5x current SIP
  // Significant increase
  showWarning = true
  suggestions = calculateAlternatives()
}
```

**Warning Display:**
```
⚠️ Important Notice

Your goal requires ₹5,00,000/month SIP, which may not be feasible.

Here are more achievable alternatives:

Option 1: Extend Timeline
├─ Current: 10 years
├─ Suggested: 15 years
└─ Required SIP: ₹3,00,000/month

Option 2: Reduce Target
├─ Current: ₹1Cr
├─ Suggested: ₹70L
└─ Required SIP: ₹3,00,000/month

Option 3: Increase Risk
├─ Current: Medium Risk
├─ Suggested: High Risk
└─ Required SIP: ₹3,50,000/month

[Use Option 1] [Use Option 2] [Use Option 3] [Continue Anyway]
```

**Rationale:**
- Provides guidance without blocking
- Helps users achieve realistic goals
- User can still proceed if desired
- Balances guidance with freedom

---

## Goal History & Local Storage

### Feature Overview

Enable users to save and manage multiple goal plans locally, allowing them to plan new goals or revisit and tweak existing goals. This feature provides persistence across sessions and enables users to work on multiple goal plans over time.

### Core Requirements

#### 1. Goal Plan Storage Structure

**Storage Key:** `wealth-mngr-goal-plans` (localStorage)

**Data Structure:**
```javascript
{
  "goal-plans": [
    {
      "id": "retirement-2024-12-15T10-30-00", // Unique ID: goalName-timestamp
      "name": "Retirement", // User-provided unique name
      "createdAt": "2024-12-15T10:30:00Z",
      "updatedAt": "2024-12-15T10:35:00Z",
      "formData": {
        "goalType": "retirement",
        "targetCorpus": 50000000,
        "timeHorizon": 30,
        "riskProfile": "high",
        "currentSavings": 500000,
        "currentSavingsAllocation": {
          "equity": 60,
          "debt": 20,
          "safe": 20
        },
        "monthlySIP": 20000,
        "stepUpEnabled": true,
        "stepUpPercentage": 10,
        "taxSlab": "30",
        "adjustInflation": true,
        "customInflationRate": null
      }
      // Note: Results calculated real-time, not stored
    }
  ]
}
```

#### 2. Goal Name Validation

**Uniqueness Check:**
- Validate against existing goal names in localStorage
- Check performed on blur/change events

**Duplicate Handling:**
- Auto-append number if duplicate name detected
- Example: "Retirement" → "Retirement 2" → "Retirement 3"
- User sees warning: "A goal with this name exists. It will be saved as '[Name] 2'"

**Validation Rules:**
- Required field
- Minimum length: 2 characters
- Maximum length: 50 characters
- Allowed characters: Letters, numbers, spaces, hyphens
- No special characters except spaces and hyphens
- Real-time validation feedback

#### 3. Auto-Save Functionality

**Trigger:** Every input change (debounced)

**Debounce Delay:** 500ms (prevents excessive localStorage writes)

**Save Scope:** Only form inputs (not calculated results - calculations are real-time)

**Save Indicator:**
- **Saving**: Subtle spinner or "Saving..." text
- **Saved**: Checkmark icon or "Saved" badge
- **Error**: Warning icon with retry option

**Error Handling:**
- Graceful fallback if localStorage fails
- Show user-friendly error message
- Retry mechanism available

#### 4. Goal Plan ID Generation

**Format:** `{goalName}-{timestamp}`

**Unique ID Generation:**
- Generated on first save (when user enters goal name)
- Timestamp format: `YYYY-MM-DDTHH-mm-ss` (ISO format, dashes for compatibility)
- Example: "Retirement-2024-12-15T10-30-00"

**Purpose:**
- Used for retrieval and updates
- Ensures uniqueness even if goal names are similar

#### 5. Goal List UI

**Landing Page Structure:**
```
┌─────────────────────────────────────┐
│   Goal Planning                     │
├─────────────────────────────────────┤
│                                     │
│   [Plan New Goal] Button (Primary)  │
│   → Opens fresh form                │
│                                     │
│   ──────────────────────────────── │
│                                     │
│   Tweak Current Goals               │
│   ──────────────────────────────── │
│                                     │
│   [Goal Card 1]                     │
│   ├─ Goal Type: Retirement          │
│   ├─ Target: ₹5Cr                  │
│   ├─ Timeline: 30 years              │
│   ├─ Risk: High                     │
│   ├─ Last Updated: Dec 15, 2024    │
│   └─ [Open] Button                  │
│                                     │
│   [Goal Card 2]                     │
│   ├─ Goal Type: Child Education     │
│   ├─ Target: ₹50L                  │
│   ├─ Timeline: 15 years              │
│   ├─ Risk: Medium                   │
│   ├─ Last Updated: Dec 10, 2024     │
│   └─ [Open] Button                  │
│                                     │
│   [Goal Card 3]                     │
│   ...                               │
└─────────────────────────────────────┘
```

**Goal Card Display:**
- **Goal Type Badge**: Color-coded (Retirement, Education, etc.)
- **Key Metrics**: Target corpus, Timeline, Risk profile
- **Last Updated**: Relative time (e.g., "2 days ago", "Just now")
- **Action**: [Open] button to load plan
- **Visual Design**: Card-based layout with hover effects

**Empty State:**
- When no saved goals exist:
  - Message: "You haven't created any goal plans yet"
  - [Plan Your First Goal] button (prominent, primary style)

#### 6. Form Pre-filling

**When:** User clicks "Open" on a goal card

**Behavior:**
- Load form data from localStorage using goal ID
- Pre-fill all form fields with saved data
- Show header: "Editing: [Goal Name]"
- Enable auto-save (updates existing goal, not creates new)
- Recalculate results immediately with pre-filled data
- Navigate to form view

#### 7. New Goal Flow

**When:** User clicks "Plan New Goal"

**Behavior:**
- Show fresh form
- **Step 1**: Prompt for goal name (required, first input)
- Validate uniqueness on blur
- Auto-generate ID on first input change after name entry
- Start auto-saving on subsequent inputs (debounced)
- Show "Creating new goal plan..." indicator

### Technical Implementation

#### Local Storage Service

**File:** `src/utils/goalPlanStorage.js`

**Functions:**
```javascript
// Save a new goal plan
saveGoalPlan(goalPlan)

// Get a specific goal plan by ID
getGoalPlan(id)

// Get all saved goal plans
getAllGoalPlans()

// Update an existing goal plan
updateGoalPlan(id, updates)

// Generate unique goal name (handles duplicates)
generateUniqueGoalName(baseName)

// Delete goal plan (Future enhancement - Phase 3)
deleteGoalPlan(id)
```

**Storage Management:**
- Single key: `wealth-mngr-goal-plans`
- Stores array of goal plan objects
- Handles JSON serialization/deserialization
- Error handling for localStorage limits

#### Zustand Store Updates

**File:** `src/store/goalPlanningStore.js`

**New Fields:**
- `goalPlanId`: Current goal plan ID (null for new goals)
- `goalName`: Current goal plan name
- `currentGoalPlan`: Full goal plan object (for editing)
- `isNewGoal`: Boolean flag (true for new, false for editing)

**New Actions:**
```javascript
// Load a goal plan from localStorage
loadGoalPlan(id)

// Create new goal plan
createNewGoalPlan()

// Auto-save (debounced)
autoSaveGoalPlan()

// Reset to new goal state
resetToNewGoal()
```

**Auto-Save Implementation:**
- Debounced function (500ms delay)
- Saves only form inputs
- Updates `updatedAt` timestamp
- Handles both new and existing goals

#### Component Structure

```
GoalPlanningPage/
├─ GoalPlanningPage.jsx (Router - landing vs form)
├─ GoalPlanningLanding.jsx (New - Landing page with goal list)
├─ GoalPlanningForm.jsx (Form component)
│  ├─ GoalNameInput.jsx (New - with uniqueness validation)
│  ├─ AutoSaveIndicator.jsx (New - visual feedback)
│  └─ [Existing form components]
└─ GoalCard.jsx (New - Card component for goal list)
```

### UX Considerations

#### Auto-Save Indicators

**Visual Feedback:**
- **Saving**: Subtle spinner icon or "Saving..." text in header
- **Saved**: Checkmark icon or "Saved" badge (appears briefly after save)
- **Error**: Warning icon with "Save failed" message and retry button

**Placement:**
- Top-right corner of form
- Non-intrusive but visible
- Auto-hide after 2 seconds for "Saved" state

#### Goal Name Input

**Placement:** First input in form (Step 1, before goal type selection)

**Validation:**
- Real-time feedback on blur
- Show duplicate warning if name exists
- Helper text: "This name helps you identify this goal plan"

**Duplicate Warning:**
- Display: "A goal with this name exists. It will be saved as '[Name] 2'"
- Color: Warning yellow/orange
- Position: Below input field

#### Mobile Considerations

**Goal Cards:**
- Stack vertically, full width on mobile
- Touch-friendly card sizes (minimum 44px height)
- Swipe actions: Future enhancement (delete in Phase 3)

**Form:**
- Goal name input prominently displayed
- Auto-save indicator visible but compact
- Smooth transitions between landing and form views

### Error Handling

**localStorage Full:**
- Show warning: "Storage limit reached. Please delete old goals."
- Provide link to manage goals (future enhancement)

**localStorage Disabled:**
- Show fallback message: "Local storage is disabled. Your goals won't be saved."
- Disable save functionality gracefully
- Allow form to work but show persistent warning

**Corrupted Data:**
- Validate on load
- Show error message: "Unable to load goal plan. Starting fresh."
- Option to clear corrupted data

**Network Issues:**
- N/A (localStorage is local, no network required)

### Performance Considerations

**Debounced Saves:**
- 500ms delay prevents excessive writes
- Reduces localStorage write operations
- Improves performance on low-end devices

**Lazy Loading:**
- Load goal list on demand (when landing page opens)
- Don't load all goal plans on app initialization

**Data Size:**
- Limit stored data (form inputs only, no calculated results)
- Estimated size: ~500 bytes per goal plan
- Reasonable limit: ~50 goal plans (~25KB)

**Cleanup:**
- Consider limit on number of saved goals (future enhancement)
- Oldest goals auto-deleted if limit exceeded (future)

### Data Migration & Compatibility

**Initial Load:**
- Check if localStorage has old format
- Handle migration gracefully
- Validate data structure on load

**Backward Compatibility:**
- Support existing data structure
- Handle missing fields gracefully
- Default values for new fields

---

### Flow Structure Overview

The Goal Planning feature follows a progressive disclosure pattern where each step builds naturally from the previous one. Key decisions are presented as primary steps, with detailed configurations available as expandable sections.

### Step-by-Step Flow

```
Step 1: Goal Type Selection (Primary Decision)
├─ Examples shown for each type
├─ Side panel: "What is goal planning?" + Goal type specific info
├─ Impact: Shows how goal type affects inflation rate, recommended instruments
└─ Next: Enable "Goal Details" section

Step 2: Goal Details (Expandable after Step 1)
├─ Target Amount
│  ├─ Input field with helper text
│  ├─ Side panel: "How much do you need?"
│  └─ Impact preview: Shows monthly SIP required
├─ Timeline
│  ├─ Input field with slider
│  ├─ Side panel: "Timeline impact on strategy"
│  └─ Impact: Auto-calculates urgency, shows risk profile impact
└─ Examples: "For retirement at 60, if you're 30..."

Step 3: Risk Profile (Contextual based on goal type + timeline)
├─ Quick Mode (Default)
│  ├─ Radio buttons: Low/Medium/High/Very High
│  ├─ Side panel: "Understanding risk profiles"
│  └─ Impact preview: Shows allocation changes
├─ Detailed Assessment (Optional)
│  ├─ Expandable questionnaire (5-7 questions)
│  ├─ Side panel: "Why risk profiling matters"
│  └─ Impact: Pre-fills risk profile, shows rationale
└─ Impact visualization: Allocation breakdown updates in real-time

Step 4: Current Savings (Progressive disclosure)
├─ Amount Input
│  ├─ Input field
│  ├─ Side panel: "Your starting point"
│  └─ Impact: Shows how current savings reduce required SIP
├─ Allocation (Auto with manual override)
│  ├─ Auto-allocated based on risk profile
│  ├─ Visual breakdown: Pie chart or bar chart
│  ├─ Side panel: "Why allocation matters"
│  ├─ [Edit Allocation] button (expandable)
│  └─ Impact preview: Shows expected returns by allocation
└─ Educational: "Moving from FD to equity can increase returns by 3-5%"

Step 5: Advanced Options (Optional, expandable)
├─ Step-Up SIP
│  ├─ Toggle switch
│  ├─ Side panel: "What is step-up SIP?"
│  └─ Impact: Shows corpus difference with/without step-up
├─ Tax Considerations
│  ├─ Expandable section
│  ├─ Tax slab selector
│  ├─ Side panel: "Tax impact on returns"
│  └─ Impact: Shows pre-tax vs post-tax corpus
└─ Inflation Customization
   ├─ Advanced setting
   ├─ Side panel: "Inflation explained"
   └─ Impact: Shows real vs nominal value

Step 6: Review & Recommendations
├─ Results Visualization
│  ├─ Results cards (Target, Projected, Shortfall)
│  ├─ Pie chart (allocation)
│  ├─ Projection graph (expandable)
│  └─ Inflation comparison (expandable)
├─ Shortfall Handling (If applicable)
│  ├─ Prioritized recommendations
│  ├─ Side panel: "How to bridge the gap"
│  └─ Impact: Shows each option's effect
└─ Specific Recommendations
   ├─ Monthly SIP breakdown
   ├─ One-time investments
   ├─ Side panel: "Why these instruments?"
   └─ Educational insights
```

### Side Panel Requirements

**Contextual Updates:**
- Side panel content updates dynamically based on:
  - Current step/question
  - User's selections (goal type, risk profile, etc.)
  - Input values (timeline, amount, etc.)

**Content Structure:**
- **What?** section: Brief definition/explanation
- **How?** section: Step-by-step mechanism
- **Why?** section: Impact and rationale
- **Example:** Real-world scenario relevant to user's inputs
- **Common Mistakes:** What to avoid

**Desktop Layout:**
```
┌─────────────────────┬──────────────────────┐
│                     │                      │
│   Form Section      │   Side Panel         │
│   (Left)            │   (Right)           │
│                     │                      │
│   [Inputs]          │   [Contextual Info] │
│   [Impact Preview]  │   [Examples]         │
│                     │   [FAQs]             │
└─────────────────────┴──────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────┐
│   Form Section      │
│   [Inputs]          │
│   [Drawer Toggle]  │ ← Opens side panel
│   [Impact Preview]  │   (Collapsible)
└─────────────────────┘
```

### Impact Visualization

**Real-time Preview Panel:**
- Updates automatically as user changes inputs
- Shows:
  - Projected corpus
  - Monthly SIP required
  - Allocation breakdown
  - Expected returns
- Visual indicators for changes (arrows, color coding)

**Before/After Comparisons:**
- Available for key decisions:
  - Goal type changes
  - Risk profile changes
  - Timeline adjustments
  - Current savings impact
- Side-by-side view showing:
  - Before: Current scenario
  - After: Modified scenario
  - Difference: Impact of change

**Desktop:**
- Impact preview panel always visible (side-by-side or below form)
- Before/After comparison in modal or expandable section

**Mobile:**
- Impact preview in collapsible section or drawer
- Before/After comparison in modal or full-screen view

### Progressive Disclosure Patterns

**Primary Level (Always Visible):**
- Goal type selector
- Target amount input
- Timeline input
- Risk profile selector (quick mode)
- Current savings amount

**Secondary Level (Expandable):**
- Detailed risk assessment questionnaire
- Current savings allocation (manual override)
- Step-up SIP settings
- Tax considerations
- Advanced inflation settings

**Tertiary Level (Deep Dive):**
- Educational content library
- Detailed FAQs
- Scenario comparisons
- Advanced calculation details

### Educational Moments

**Throughout the Flow:**
1. **Goal Type Selection**: "Why different goals need different strategies"
2. **Timeline Entry**: "How timeline affects risk and returns"
3. **Risk Profile**: "Understanding your risk tolerance"
4. **Current Savings**: "Optimizing your existing investments"
5. **Results Review**: "Understanding your goal plan"

**Each Moment Includes:**
- Brief explanation (What?)
- Mechanism (How?)
- Impact (Why?)
- Example scenario
- Common mistakes to avoid

---

## Interdependencies Summary

### Critical Dependencies

1. **Question 1 (Goal Types)** affects:
   - Question 2 (Urgency): Different goal types have different urgency
   - Question 3 (Current Savings): Different allocation rules per goal type
   - Question 4 (Tax): Different tax implications
   - Question 8 (Inflation): Different inflation rates per goal type

2. **Question 6 (Risk Profile)** affects:
   - Question 3 (Current Savings Allocation)
   - Question 7 (Recommendations)
   - Question 9 (Shortfall Options)

3. **Question 4 (Tax)** affects:
   - Question 7 (Recommendations): Tax-efficient instruments (Phase 2+)
   - Question 11 (Visualization): Post-tax vs pre-tax display (Phase 2+)
   - **Phase 1**: Pre-tax only, no tax impact on recommendations

4. **Question 5 (Multiple Goals)** affects:
   - Question 9 (Shortfall): Need to allocate across goals (Phase 2+)
   - Question 12 (Unrealistic Goals): Need to consider total SIP capacity (Phase 2+)
   - **Phase 1**: Single goal per session, independent goal plans

### Decision Flow

```
Start
  ↓
Question 1: Goal Type Selection
  ↓
Question 6: Risk Profile (Questionnaire or Self-Select)
  ↓
Question 3: Current Savings Allocation (Auto or Manual)
  ↓
Question 8: Inflation Rate (Default with Goal Override)
  ↓
Question 10: Step-Up SIP (Optional)
  ↓
Calculation Engine
  ↓
Question 9: Shortfall Recommendations (If Shortfall)
  ↓
Question 7: Specific Recommendations
  ↓
Question 11: Visualization Display
  ↓
Question 12: Validation & Warnings
  ↓
Results Display
```

---

## Recommended MVP Feature Set

### Phase 1: Core Goal Planning + History (MVP)

**Goal Types:**
- Retirement (age-based calculations)
- Child Education (SSY-specific recommendations)
- House Purchase (real estate inflation consideration)
- Generic Goal (catch-all)
- **Single Goal Focus**: One goal at a time to reduce cognitive load

**Goal History & Local Storage:**
- Save goal plans to localStorage
- Auto-save functionality (debounced, 500ms)
- Goal name validation with duplicate handling
- Goal list UI with cards showing key metrics
- Form pre-filling for editing existing goals
- Landing page with "Plan New Goal" and "Tweak Current Goals" options

**Risk Profile:**
- Quick Mode: Self-selection (Low/Medium/High/Very High)
- Detailed Mode: Questionnaire (optional)

**Current Savings:**
- **Flow 1 (Active)**: Fresh start, no current savings allocation
- **Flow 2 (Coming Soon)**: Current savings allocation with auto-algorithm (Phase 2)

**Tax Considerations:**
- **Pre-tax returns only** (matches current calculator implementations)
- Tax slab selector: Not included in Phase 1
- Tax-adjusted calculations: Phase 2+ enhancement
- Rationale: Simplest implementation for POC validation

**Multiple Goals:**
- **Single goal per session** (POC focus)
- Users can create multiple goal plans separately via Goal History
- Each goal plan is independent
- Multi-goal dashboard: Phase 2+ enhancement

**Inflation:**
- Default: 6% (from user preferences)
- Goal-type overrides: Education (8%), Healthcare (7%)

**Step-Up SIP:**
- Optional, default disabled
- 10% default step-up

**Recommendations:**
- Specific instrument recommendations with amounts
- Tax-aware recommendations (Phase 2+)
- Alternative scenarios (expandable)

**Visualization:**
- Results cards
- Pie chart (allocation)
- Recommendations table
- Projection graph (expandable)
- Inflation comparison (expandable)

**Shortfall Handling:**
- Prioritized recommendations
- Increase SIP, Extend timeline, Add lumpsum, Increase risk
- Feasibility scoring

**Edge Cases:**
- Unrealistic goals: Warning + auto-suggest alternatives
- Continue anyway option

### Phase 2: Multi-Goal Planning + Tax Implementation

**Multi-Goal Dashboard:**
- Multiple goals dashboard
- Priority ranking
- Resource allocation algorithm
- "SIP capacity: ₹50K/month → Allocate across goals"

**Tax Implementation:**
- Tax slab selector (5%, 10%, 15%, 20%, 30%, New Regime)
- Post-tax returns calculation
- Tax-adjusted corpus display
- Tax efficiency recommendations

**Current Savings Flow 2:**
- Current savings allocation with auto-algorithm
- Portfolio analysis and re-allocation help

**Additional Goal Types:**
- Emergency Fund
- Vacation/Travel
- Marriage
- Custom goal types

### Phase 3: Goal Management & Advanced Features

**Goal Management:**
- Delete goal functionality
- Duplicate/clone goal
- Rename goal
- Export goal plan (PDF/Excel)
- Share goal plan

**Advanced Features:**
- Goal comparison view
- Progress tracking integration
- Goal analytics and insights

---

## Implementation Considerations

### Technical Architecture

**State Management:**
- Use Zustand store (`goalPlanningStore.js`)
- Store: Goal data, risk profile, current savings, recommendations, results

**Components Structure:**
```
GoalPlanningPage/
├─ GoalPlanningPage.jsx (Main container/router - landing vs form)
├─ GoalPlanningLanding.jsx (New - Landing page with goal list)
├─ GoalPlanningForm.jsx (Form component)
│  ├─ GoalNameInput.jsx (New - with uniqueness validation)
│  ├─ AutoSaveIndicator.jsx (New - visual feedback for save status)
│  ├─ EducationalSidePanel.jsx (Contextual information panel)
│  ├─ ImpactPreview.jsx (Real-time impact visualization)
│  ├─ ProgressiveForm.jsx (Step-based form wrapper)
│  ├─ ExampleScenarios.jsx (Reusable example component)
│  ├─ WhatHowWhyTooltip.jsx (Educational tooltip component)
│  ├─ RiskProfileSelector.jsx (Quick + Detailed)
│  ├─ CurrentSavingsAllocator.jsx (Auto + Manual)
│  ├─ GoalPlanningResults.jsx (Results display)
│  ├─ RecommendationsTable.jsx (Specific recommendations)
│  ├─ ProjectionChart.jsx (Growth graph with annotations)
│  ├─ InflationComparison.jsx (Nominal vs real)
│  └─ ShortfallRecommendations.jsx (Shortfall options)
├─ GoalCard.jsx (New - Card component for goal list display)
├─ hooks/
│  ├─ useGoalPlanning.js (Calculation logic)
│  └─ useImpactPreview.js (Impact calculation hook)
├─ schemas/
│  └─ goalPlanningSchema.js (Joi validation)
└─ constants/
   └─ educationalContent.js (What/How/Why content library)
```

**Layout Structure:**

**Desktop:**
```
┌─────────────────────┬──────────────────────┐
│                     │                      │
│   Form Section      │   Side Panel         │
│   (Left, 60%)       │   (Right, 40%)      │
│                     │                      │
│   [Progressive Form]│   [Contextual Info] │
│   [Impact Preview]  │   [What/How/Why]     │
│                     │   [Examples]         │
│                     │   [FAQs]             │
└─────────────────────┴──────────────────────┘
│   Results Section (Full width below)       │
│   [Results Cards] [Charts] [Tables]        │
└────────────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│   Form Section      │
│   [Progressive Form]│
│   [Drawer Toggle]  │ ← Opens side panel
│   [Impact Preview]  │   (Slide-out drawer)
│   [Collapsible]     │
├─────────────────────┤
│   Results Section   │
│   [Results Cards]    │
│   [Charts]          │
│   [Tables]          │
└─────────────────────┘
```

**Calculation Engine:**
- Reuse existing calculation functions
- Add goal-specific calculations
- Tax-adjusted calculations
- Shortfall detection algorithm
- Recommendation generation algorithm

**Goal Plan Storage Service:**
- **File:** `src/utils/goalPlanStorage.js`
- **Storage Key:** `wealth-mngr-goal-plans`
- **Functions:**
  - `saveGoalPlan(goalPlan)`: Save new or update existing goal plan
  - `getGoalPlan(id)`: Retrieve specific goal plan by ID
  - `getAllGoalPlans()`: Get all saved goal plans
  - `updateGoalPlan(id, updates)`: Update existing goal plan
  - `generateUniqueGoalName(baseName)`: Generate unique name with auto-numbering
  - `deleteGoalPlan(id)`: Delete goal plan (Phase 3)
- **Features:**
  - JSON serialization/deserialization
  - Error handling for localStorage limits
  - Data validation on load
  - Migration support for future schema changes

### Financial Accuracy Requirements

**Validations:**
- Target corpus: Min ₹1L, Max ₹10Cr
- Time horizon: Min 1 year, Max 50 years
- Current savings: Min ₹0, Max ₹5Cr
- Monthly SIP: Min ₹500, Max ₹5L/month
- Risk profile: Must be selected
- Tax slab: 5%, 10%, 15%, 20%, 30%, New Regime

**Calculation Accuracy:**
- Round to 2 decimal places for amounts
- Round to 1 decimal place for percentages
- Use decimal rates (not percentages) in calculations
- Validate all inputs before calculations

**Tax Calculations:**
- PPF/SSY: Fully tax-free
- ELSS: Section 80C + LTCG after 1 year
- FD: Interest taxable as per slab
- NPS: 60% tax-free, 40% taxable
- Equity: LTCG after 1 year

### Mobile-Specific Requirements

#### Responsive Layout Patterns

**Side Panel (Educational Content):**
- **Desktop**: Fixed right panel (40% width), always visible
- **Mobile**: Slide-out drawer (overlay), accessible via:
  - Floating action button (FAB) with info icon
  - Drawer toggle button in header
  - Swipe gesture from right edge
- **Drawer Behavior**:
  - Opens from right side
  - Backdrop overlay (semi-transparent)
  - Close via: X button, backdrop tap, or swipe right
  - Smooth slide animation (300ms)

**Impact Preview Panel:**
- **Desktop**: Side-by-side with form or below form
- **Mobile**: Collapsible section below form
  - Default: Collapsed (shows summary only)
  - Expandable: Tap to expand full preview
  - Sticky header: "Impact Preview" always visible
  - Smooth expand/collapse animation

**Form Inputs:**
- **Touch-Friendly Targets**: Minimum 44x44px tap targets
- **Input Fields**: Large, readable fonts (16px minimum)
- **Radio Buttons/Cards**: Large, easily tappable
- **Sliders**: Thumb size appropriate for touch
- **Dropdowns**: Full-screen modals or bottom sheets on mobile

**Charts and Visualizations:**
- **Responsive Charts**: Stack vertically on mobile
- **Pie Chart**: Larger segments for easier tapping
- **Projection Graph**: Horizontal scroll enabled
- **Tooltips**: Tap to show, tap outside to dismiss
- **Comparison Views**: Swipeable cards or tabs

**Progressive Disclosure:**
- **Accordion Pattern**: Collapsible sections
- **Expandable Sections**: Smooth animations
- **Sticky Headers**: Section headers remain visible while scrolling
- **Breadcrumb Navigation**: Show current step/progress

**Performance Considerations:**
- **Lazy Loading**: Load educational content on demand
- **Image Optimization**: Optimize example images
- **Animation Performance**: Use CSS transforms for smooth animations
- **Viewport Optimization**: Minimize reflows/repaints

#### Mobile-Specific Interactions

**Gestures:**
- **Swipe Right**: Close side panel drawer
- **Swipe Left**: Open side panel drawer (from edge)
- **Swipe Up/Down**: Scroll through form sections
- **Pinch Zoom**: Disabled for charts (prevent accidental zoom)

**Navigation:**
- **Sticky Header**: Progress indicator and navigation
- **Back Button**: Browser back button returns to previous step
- **Scroll Restoration**: Remember scroll position when returning

**Accessibility:**
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Focus moves to opened drawer
- **Keyboard Navigation**: Tab through form elements
- **High Contrast**: Support for system dark mode

#### Mobile Component Specifications

**EducationalSidePanel (Mobile):**
- Width: 85% of screen width
- Height: Full screen height
- Position: Overlay (above content)
- Animation: Slide in from right
- Close button: Top-right corner

**ImpactPreview (Mobile):**
- Collapsible card component
- Summary view: Key metrics only
- Expanded view: Full breakdown
- Sticky positioning: Optional (can scroll with content)

**ProgressiveForm (Mobile):**
- Single column layout
- Step indicators: Top of form
- Section dividers: Clear visual separation
- Smooth scroll: Auto-scroll to next section on step completion

---

## Future Enhancements

### Goal Management Features (Phase 3+)

**Delete Goal Functionality:**
- Delete button on goal cards
- Confirmation dialog before deletion
- Permanent removal from localStorage
- Empty state handling after deletion

**Duplicate/Clone Goal:**
- "Duplicate" option on goal cards
- Creates new goal with same data but different name
- Auto-generates new ID and name (e.g., "Retirement Copy")
- Useful for creating similar goals with slight variations

**Rename Goal:**
- Edit goal name inline or via modal
- Validation: Same uniqueness rules as new goals
- Updates localStorage without changing ID
- Updates `updatedAt` timestamp

**Export Functionality:**
- Export goal plan as PDF
- Export goal plan as Excel/CSV
- Include form data and calculated results
- Printable format option

**Share Goal Plan:**
- Generate shareable link (if backend integration)
- Export as JSON file
- Email goal plan summary

**Goal Comparison View:**
- Side-by-side comparison of multiple goals
- Compare corpus, SIP requirements, timelines
- Visual comparison charts

**Progress Tracking Integration:**
- Track actual investments vs planned
- Show progress towards goal
- Update projections based on actual performance
- Milestone tracking

### Additional Features

**Goal Analytics:**
- Dashboard showing all goals overview
- Total SIP required across all goals
- Timeline visualization
- Risk profile distribution

**Goal Recommendations:**
- AI-powered suggestions based on user profile
- Optimal goal prioritization
- Resource allocation recommendations

**Goal Templates:**
- Pre-built goal templates
- Common scenarios (e.g., "Retirement at 60")
- Quick start options

**Backup & Sync:**
- Export/import all goals
- Cloud sync (if backend integration)
- Cross-device access

---

## Open Questions & Next Steps

### Questions Requiring User Input

1. **Income Input:** Should we ask for user's income to validate SIP feasibility?
2. **Goal Flexibility:** How to handle flexible vs fixed goal timelines?
3. **Export Functionality:** Should users be able to export/print goal plan?
4. **Comparison Mode:** Should users be able to compare multiple scenarios side-by-side?
5. **Progress Tracking:** Should goal planning integrate with future progress tracking feature?

### Next Steps

1. **Review this document** with stakeholders
2. **Answer open questions** above
3. **Prioritize Phase 1 MVP** features
4. **Create detailed user stories** for each feature
5. **Design UI/UX mockups** for complex components
6. **Create technical specification** document
7. **Begin implementation** of Phase 1 MVP

---

## Appendix: Risk Profile Asset Allocation Matrix

### Low Risk Profile
- Equity/MF: 20%
- Debt: 40%
- Safe (PPF/FD/NSC): 40%
- Expected Return: ~7-8%

### Medium Risk Profile
- Equity/MF: 40%
- Debt: 30%
- Safe: 30%
- Expected Return: ~9-10%

### High Risk Profile
- Equity/MF: 60%
- Hybrid: 20%
- Debt: 20%
- Expected Return: ~11-12%

### Very High Risk Profile
- Equity: 80%
- SGB: 10%
- Debt: 10%
- Expected Return: ~12-14%

---

## Appendix: Goal Type Specific Rules

### Retirement
- **Default Inflation:** 6%
- **Timeline:** Age-based (retirement age - current age)
- **Tax Optimization:** High (Section 80C, 80CCD)
- **Urgency:** Low (long-term)
- **Recommended Instruments:** NPS, PPF, ELSS

### Child Education
- **Default Inflation:** 8% (education inflation)
- **Timeline:** Fixed (child's age + years to goal)
- **Tax Optimization:** Medium (SSY if applicable)
- **Urgency:** Medium
- **Recommended Instruments:** SSY, ELSS, Equity Funds

### House Purchase
- **Default Inflation:** 6% (or real estate inflation if available)
- **Timeline:** Flexible
- **Tax Optimization:** Low
- **Urgency:** Medium-High
- **Recommended Instruments:** Balanced approach, FD for short-term

### Generic Goal
- **Default Inflation:** 6%
- **Timeline:** User-defined
- **Tax Optimization:** Medium
- **Urgency:** Auto-determined
- **Recommended Instruments:** Based on risk profile

---

**Document Status:** Draft - Awaiting Stakeholder Review
**Next Review:** After stakeholder feedback
