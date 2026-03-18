import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import VentasPage from './pages/VentasPage'
import InventarioPage from './pages/InventarioPage'
import ProduccionPage from './pages/ProduccionPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/produccion" element={<ProduccionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
