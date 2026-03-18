import { colorSemaforo } from '../utils/format'

export default function AlertCard({ producto, cantidad, unidad, nivel }) {
  const color = colorSemaforo(nivel)

  return (
    <div className="alert-card" style={{ borderLeftColor: color, background: `${color}08` }}>
      <div className="alert-card__content">
        <p className="alert-card__title">{producto}</p>
        <p className="alert-card__sub">
          {cantidad ?? 0} {unidad || 'uds'} restantes
        </p>
      </div>
      <span
        className="alert-card__badge"
        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
      >
        {nivel === 'rojo' ? 'Crítico' : 'Bajo'}
      </span>
    </div>
  )
}
