import { colorSemaforo, labelSemaforo, bgSemaforo } from '../utils/format'

export default function StockBadge({ nivel }) {
  if (!nivel) return null
  const color = colorSemaforo(nivel)

  return (
    <span
      className="stock-badge"
      style={{
        background: bgSemaforo(nivel),
        color,
        border: `1px solid ${color}40`,
      }}
    >
      <span className="stock-badge__dot" style={{ background: color }} />
      {labelSemaforo(nivel)}
    </span>
  )
}
