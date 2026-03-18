import { useMemo } from 'react'
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Factory,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import KPICard from '../components/KPICard'
import AlertCard from '../components/AlertCard'
import EmptyState from '../components/EmptyState'
import ErrorAlert from '../components/ErrorAlert'
import { SkeletonKPI, SkeletonTable, SkeletonChart } from '../components/Skeleton'
import { useVentas } from '../hooks/useVentas'
import { useInventario } from '../hooks/useInventario'
import { useProduccionGomitas } from '../hooks/useProduccionGomitas'
import { useProduccionDulces } from '../hooks/useProduccionDulces'
import { formatLPS, formatLPSCompact, formatFecha, formatFechaCorta, formatPct } from '../utils/format'

const DONUT_COLORS = ['#2563EB', '#F472B6', '#A78BFA', '#FB923C', '#22C55E', '#64748B']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="chart-tooltip__value" style={{ color: p.color }}>
          {p.name}: {formatLPS(p.value)}
        </p>
      ))}
    </div>
  )
}

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{payload[0].name}</p>
      <p className="chart-tooltip__value" style={{ color: payload[0].payload.fill }}>
        {formatLPS(payload[0].value)}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const ventas = useVentas()
  const inventario = useInventario()
  const gomitas = useProduccionGomitas()
  const dulces = useProduccionDulces()

  const produccionHoy = useMemo(
    () => gomitas.bolsasHoy + dulces.bolsasHoy,
    [gomitas.bolsasHoy, dulces.bolsasHoy]
  )

  const last30Days = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    const cutoffStr = cutoff.toISOString().split('T')[0]
    return ventas.ventasPorDia
      .filter((d) => d.fecha >= cutoffStr)
      .map((d) => ({
        ...d,
        label: formatFechaCorta(d.fecha),
      }))
  }, [ventas.ventasPorDia])

  const donutData = useMemo(
    () =>
      ventas.ventasPorProducto.slice(0, 6).map((p, i) => ({
        name: p.producto,
        value: p.ingresos,
        fill: DONUT_COLORS[i % DONUT_COLORS.length],
      })),
    [ventas.ventasPorProducto]
  )

  const ultimas10 = useMemo(() => ventas.data.slice(0, 10), [ventas.data])

  const hasError = ventas.error || inventario.error || gomitas.error || dulces.error

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Dashboard</h1>
        <p className="page__subtitle">Resumen del negocio en tiempo real</p>
      </div>

      {hasError && <ErrorAlert message="Error al conectar con Supabase. Verifica tu conexión." />}

      <div className="kpi-grid">
        {ventas.loading || gomitas.loading || dulces.loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
        ) : (
          <>
            <KPICard title="Ventas hoy" value={ventas.totalesHoy.ventas} icon={ShoppingCart} accentColor="#2563EB" />
            <KPICard title="Ingresos hoy" value={formatLPSCompact(ventas.totalesHoy.ingresos)} icon={DollarSign} accentColor="#F472B6" />
            <KPICard title="Ganancia hoy" value={formatLPSCompact(ventas.totalesHoy.ganancia)} icon={TrendingUp} accentColor="#A78BFA" />
            <KPICard title="Producción hoy" value={`${produccionHoy} bolsas`} icon={Factory} accentColor="#FB923C" />
          </>
        )}
      </div>

      <div className="charts-row">
        <div className="card card--2x">
          <h3 className="card__title">Ventas — últimos 30 días</h3>
          {ventas.loading ? <SkeletonChart /> : last30Days.length === 0 ? <EmptyState /> : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={last30Days}>
                  <defs>
                    <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="ingresos" stroke="#2563EB" fill="url(#gradIngresos)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="card card--1x">
          <h3 className="card__title">Ventas por producto</h3>
          {ventas.loading ? <SkeletonChart height={200} /> : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                    {donutData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
