export default function Skeleton({ width = '100%', height = 20, borderRadius = 8, style = {} }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius, ...style }} />
  )
}

export function SkeletonKPI() {
  return (
    <div className="kpi-card" style={{ padding: '20px 24px' }}>
      <Skeleton width="60%" height={14} />
      <Skeleton width="40%" height={28} style={{ marginTop: 8 }} />
      <Skeleton width="30%" height={12} style={{ marginTop: 12 }} />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', background: '#F1F5F9' }}>
        <Skeleton width="30%" height={14} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: '12px 20px', display: 'flex', gap: 16, borderBottom: '1px solid #F1F5F9' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} width={`${100 / cols}%`} height={14} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart({ height = 240 }) {
  return (
    <div className="card">
      <Skeleton width="40%" height={16} />
      <Skeleton width="100%" height={height} style={{ marginTop: 16 }} borderRadius={12} />
    </div>
  )
}
