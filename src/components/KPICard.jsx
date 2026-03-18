import { memo } from 'react'

const KPICard = memo(function KPICard({ title, value, delta, deltaType, icon: Icon, accentColor }) {
  return (
    <div className="kpi-card" style={{ '--accent': accentColor }}>
      <div className="kpi-card__header">
        <div>
          <p className="kpi-card__label">{title}</p>
          <p className="kpi-card__value">{value}</p>
        </div>
        <div className="kpi-card__icon" style={{ background: `${accentColor}15`, color: accentColor }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      {delta !== undefined && delta !== null && (
        <div className="kpi-card__delta" data-type={deltaType}>
          <span className="kpi-card__delta-arrow">{deltaType === 'up' ? '↑' : '↓'}</span>
          <span>{delta}</span>
        </div>
      )}
    </div>
  )
})

export default KPICard
