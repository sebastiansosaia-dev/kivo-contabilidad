import { useState, useMemo } from 'react'
import { useInventario } from '../hooks/useInventario'
import StockBadge from '../components/StockBadge'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import { SkeletonTable } from '../components/Skeleton'

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'rojo', label: 'Crítico' },
  { key: 'amarillo', label: 'Bajo' },
  { key: 'verde', label: 'Óptimo' },
]

export default function InventarioPage() {
  const { data, loading, error, conteo } = useInventario()
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return data
    return data.filter((i) => i.nivel_estado === filter)
  }, [data, filter])

  if (error) return <ErrorAlert message="Error al cargar inventario" />

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Inventario</h1>
        <p className="page__subtitle">Estado de stock en tiempo real</p>
      </div>
      <div className="filter-bar">
        {FILTERS.map(({ key, label }) => (
          <button key={key} className={`filter-btn ${filter === key ? 'filter-btn--active' : ''}`} onClick={() => setFilter(key)}>
            {label}
            <span className="filter-btn__count">{key === 'all' ? conteo.total : conteo[key]}</span>
          </button>
        ))}
      </div>
      {loading ? <SkeletonTable rows={6} cols={5} /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="text-bold">{item.producto}</td>
                    <td>{item.cantidad_actual ?? 0}</td>
                    <td className="text-muted">{item.unidad}</td>
                    <td><StockBadge nivel={item.nivel_estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
