import StatusBadge from './StatusBadge'
import { weekLabel } from '../data/constants'
import { userName } from '../data/mockData'

const FIELDS = [
  { key: 'progress', label: '주요 진행 내용' },
  { key: 'quantitativeValue', label: '정량 성과' },
  { key: 'qualitativeValue', label: '정성 성과' },
  { key: 'issues', label: '이슈 및 리스크' },
  { key: 'nextPlan', label: '다음 주 계획' },
  { key: 'supportNeeded', label: '지원 요청 사항' },
]

export default function ReportView({ report }) {
  if (!report) return null
  return (
    <div>
      <div className="spread" style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 18 }}>{report.title}</h2>
        <StatusBadge status={report.status} />
      </div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
        {weekLabel(report.week)} · {[report.office, report.team].filter(Boolean).join(' · ')} · 작성자 {userName(report.authorId)}
      </p>
      {FIELDS.map((f) => (
        <div className="detail-block" key={f.key}>
          <div className="k">{f.label}</div>
          <div className="v">{report[f.key]?.trim() ? report[f.key] : <span className="muted">미작성</span>}</div>
        </div>
      ))}
    </div>
  )
}
