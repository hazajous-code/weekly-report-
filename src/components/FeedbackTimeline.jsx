import { ACTION_LABEL, ROLE_LABEL, FEEDBACK_ACTION } from '../data/constants'
import { userName, getUser } from '../data/mockData'

function fmt(ts) {
  try {
    const d = new Date(ts)
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(
      d.getMinutes(),
    ).padStart(2, '0')}`
  } catch {
    return ts
  }
}

const TONE = {
  [FEEDBACK_ACTION.APPROVE]: 'approve',
  [FEEDBACK_ACTION.REJECT]: 'reject',
}
const ACTION_BADGE = {
  [FEEDBACK_ACTION.APPROVE]: 'badge-green',
  [FEEDBACK_ACTION.REJECT]: 'badge-red',
  [FEEDBACK_ACTION.SUBMIT]: 'badge-blue',
  [FEEDBACK_ACTION.COMMENT]: 'badge-indigo',
}

export default function FeedbackTimeline({ history = [] }) {
  if (!history.length) {
    return <p className="muted" style={{ fontSize: 13 }}>아직 피드백 이력이 없습니다.</p>
  }
  return (
    <div className="timeline">
      {history.map((f) => (
        <div className={`tl-item ${TONE[f.action] || ''}`} key={f.id}>
          <span className="tl-dot" />
          <div className="tl-head">
            <strong>{userName(f.writerId)}</strong>
            <span className="muted" style={{ fontSize: 12 }}>
              {ROLE_LABEL[getUser(f.writerId)?.role] || f.writerRole}
            </span>
            <span className={`badge ${ACTION_BADGE[f.action] || 'badge-gray'}`}>
              {ACTION_LABEL[f.action] || f.action}
            </span>
            <span className="tl-time">{fmt(f.createdAt)}</span>
          </div>
          {f.comment && <div className="tl-body">{f.comment}</div>}
        </div>
      ))}
    </div>
  )
}
