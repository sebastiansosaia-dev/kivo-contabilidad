import { Inbox } from 'lucide-react'

export default function EmptyState({ message = 'No hay datos disponibles', icon: Icon = Inbox }) {
  return (
    <div className="empty-state">
      <Icon size={40} strokeWidth={1.2} />
      <p>{message}</p>
    </div>
  )
}
