import { STATUS_META } from '../data/constants'

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, tone: 'gray' }
  return (
    <span className={`badge badge-${meta.tone}`}>
      <span className="dot" />
      {meta.label}
    </span>
  )
}
