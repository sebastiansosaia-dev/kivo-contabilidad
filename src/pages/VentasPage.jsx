import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useVentas } from '../hooks/useVentas'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import { SkeletonTable, SkeletonChart } from '../components/Skeleton'
import { formatLPS, formatFecha, formatPct } from '../utils/format'

export default function VentasPage() {
  const { data, loading, error, ventasPorProducto } = useVentas()
  const [period, setPeriod] = useState('todo')

  if (error) return <ErrorAlert message="Error al cargar ventas" />

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Ventas</h1>
        <p className="page__subtitle">Análisis de ventas y márgenes</p>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <SkeletonTable rows={8} cols={6} /> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Ingreso</th>
                  <th>Ganancia</th>
                </tr>
              </thead>
              <tbody>
                {data.map((v) => (
                  <tr key={v.id}>
                    <td className="text-muted">{formatFecha(v.fecha)}</td>
                    <td className="text-bold">{v.producto}</td>
                    <td>{v.cant_vendida}</td>
                    <td className="text-blue">{formatLPS(v.ingreso_total)}</td>
                    <td className="text-green">{formatLPS(v.ganancia_bruta)}</td>
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
