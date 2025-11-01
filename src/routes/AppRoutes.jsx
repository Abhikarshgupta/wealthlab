import { Routes, Route } from 'react-router-dom'
import { routes } from '@/routes/routes'
import Home from '@/pages/Home/Home'
import CalculatorPage from '@/pages/calculators/CalculatorPage'
import GoalPlanningPage from '@/pages/GoalPlanningPage/GoalPlanningPage'
import CorpusCalculatorPage from '@/pages/CorpusCalculatorPage/CorpusCalculatorPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.calculators.index} element={<CalculatorPage />} />
      <Route path={routes.calculators.ppf} element={<CalculatorPage calculatorType="ppf" />} />
      <Route path={routes.calculators.fd} element={<CalculatorPage calculatorType="fd" />} />
      <Route path={routes.calculators.sip} element={<CalculatorPage calculatorType="sip" />} />
      <Route path={routes.calculators.equity} element={<CalculatorPage calculatorType="equity" />} />
      <Route path={routes.calculators.nps} element={<CalculatorPage calculatorType="nps" />} />
      <Route path={routes.calculators.ssy} element={<CalculatorPage calculatorType="ssy" />} />
      <Route path={routes.calculators.sgb} element={<CalculatorPage calculatorType="sgb" />} />
      <Route path={routes.calculators.nsc} element={<CalculatorPage calculatorType="nsc" />} />
      <Route path={routes.calculators.elss} element={<CalculatorPage calculatorType="elss" />} />
      <Route path={routes.calculators.scss} element={<CalculatorPage calculatorType="scss" />} />
      <Route path={routes.goalPlanning} element={<GoalPlanningPage />} />
      <Route path={routes.corpusCalculator} element={<CorpusCalculatorPage />} />
    </Routes>
  )
}

export default AppRoutes