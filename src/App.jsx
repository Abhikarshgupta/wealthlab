import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import AppRoutes from '@/routes/AppRoutes'
import MainLayout from '@/components/common/Layout/MainLayout'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App