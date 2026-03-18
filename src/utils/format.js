// Currency — Honduran Lempiras
export const formatLPS = (v) =>
  `L. ${new Intl.NumberFormat('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v ?? 0)}`

// Compact currency for KPI cards
export const formatLPSCompact = (v) => {
  const num = Number(v ?? 0)
  if (num >= 1000000) return `L. ${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `L. ${(num / 1000).toFixed(1)}K`
  return `L. ${num.toFixed(0)}`
}

// Date — Honduran format dd/MM/yyyy
export const formatFecha = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-HN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Short date — dd/MM
export const formatFechaCorta = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit' })
}

// Percentage
export const formatPct = (v) => `${Number(v ?? 0).toFixed(1)}%`

// Inventory semaphore colors
export const colorSemaforo = (nivel) =>
  ({
    rojo: '#EF4444',
    amarillo: '#F59E0B',
    verde: '#22C55E',
  })[nivel] || '#94A3B8'

// Semaphore label
export const labelSemaforo = (nivel) =>
  ({
    rojo: 'Crítico',
    amarillo: 'Bajo',
    verde: 'Óptimo',
  })[nivel] || 'Desconocido'

// Background for semaphore badge
export const bgSemaforo = (nivel) =>
  ({
    rojo: 'rgba(239,68,68,0.1)',
    amarillo: 'rgba(245,158,11,0.1)',
    verde: 'rgba(34,197,94,0.1)',
  })[nivel] || 'rgba(148,163,184,0.1)'
