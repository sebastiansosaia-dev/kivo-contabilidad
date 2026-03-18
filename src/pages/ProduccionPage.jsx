import { useState } from 'react'
import { useProduccionGomitas } from '../hooks/useProduccionGomitas'
import { useProduccionDulces } from '../hooks/useProduccionDulces'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import { SkeletonTable } from '../components/Skeleton'
import { formatFecha, formatLPS } from '../utils/format'

const TABS = [
  { key: 'gomitas', label: '🍬 Gomitas' },
  { key: 'dulces', label: '🍭 Dulces' },
]

export default function ProduccionPage() {
  const [tab, setTab] = useState('gomitas')
  const gomitas = useProduccionGomitas()
  const dulces = useProduccionDulces()
  const current = tab === 'gomitas' ? gomitas : dulces
  const { data, loading, error, bolsasHoy, bolsasTotal } = current

  if (error) return <ErrorAlert message="Error al cargar producción" />

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Producción</h1>
        <p className="page__subtitle">Registro de producción diaria</p>
      </div>
      <div className="filter-bar">
        {TABS.map(({ key, label }) => (
          <button key={key} className={`filter-btn ${tab === key ? 'filter-btn--active' : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      <div className="summary-row">
        <div className="summary-card">
          <span className="summary-card__label">Bolsas hoy</span>
          <span className="summary-card__value" style={{ color: '#FB923C' }}>{bolsasHoy}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Total bolsas</span>
          <span className="summary-card__value">{bolsasTotal}</span>
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <SkeletonTable rows={6} cols={4} /> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Bolsas</th>
                  <th>Detalle</th>
                  {tab === 'dulces' && <th>Costo</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td className="text-muted">{formatFecha(row.fecha)}</td>
                    <td className="text-bold">{row.bolsas}</td>
                    <td>{row.detalle_plantilla}</td>
                    {tab === 'dulces' && <td className="text-blue">{formatLPS(row.costo_total)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
