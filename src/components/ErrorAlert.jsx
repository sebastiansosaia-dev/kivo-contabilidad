import { AlertTriangle } from 'lucide-react'

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="error-alert">
      <AlertTriangle size={18} />
      <span>{message || 'Error al cargar datos'}</span>
      {onRetry && (
        <button className="error-alert__retry" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
