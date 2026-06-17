import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ReportView from '../components/ReportView'
import FeedbackTimeline from '../components/FeedbackTimeline'
import StatusBadge from '../components/StatusBadge'
import { ROLES, weekLabel } from '../data/constants'
import { userName } from '../data/mockData'

export default function FeedbackHistory() {
  const { currentUser, reports, params, navigate } = useApp()
  const [selectedId, setSelectedId] = useState(params.reportId || null)

  // 역할별 접근 범위
  const visible = reports.filter((r) => {
    if (currentUser.role === ROLES.EMPLOYEE) return r.authorId === currentUser.id
    if (currentUser.role === ROLES.TEAMLEAD) return r.team === currentUser.team
    if (currentUser.role === ROLES.MANAGER) return r.office === currentUser.office
    return true // 전략기획팀, 임원은 전체 조회
  })

  const selected = visible.find((r) => r.id === selectedId)
  const sorted = [...visible].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>피드백 · 이력</h1>
          <p className="sub">누가 · 언제 · 어떤 의견을 남겼는지 보고서별로 추적합니다.</p>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-head"><h3>보고서 목록 ({sorted.length})</h3></div>
          <table className="table">
            <thead>
              <tr><th>주차</th><th>제목</th><th>작성자</th><th>상태</th><th>피드백</th></tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr
                  key={r.id}
                  className={`clickable ${selectedId === r.id ? '' : ''}`}
                  onClick={() => setSelectedId(r.id)}
                  style={selectedId === r.id ? { background: 'var(--primary-soft)' } : undefined}
                >
                  <td className="muted">{weekLabel(r.week)}</td>
                  <td>{r.title}</td>
                  <td>{userName(r.authorId)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="muted">{(r.feedbackHistory || []).length}건</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stack">
          {selected ? (
            <>
              <div className="card card-pad">
                <ReportView report={selected} />
                {currentUser.role === ROLES.EMPLOYEE && selected.authorId === currentUser.id && (
                  <button className="btn btn-primary mt18" onClick={() => navigate('report-editor', { reportId: selected.id })}>
                    이 보고서 열기 / 수정
                  </button>
                )}
              </div>
              <div className="card card-pad">
                <h3 style={{ fontSize: 14, marginBottom: 12 }}>피드백 타임라인</h3>
                <FeedbackTimeline history={selected.feedbackHistory} />
              </div>
            </>
          ) : (
            <div className="card card-pad">
              <div className="empty-state">
                <div className="ico">💬</div>
                <p>왼쪽 목록에서 보고서를 선택하면<br />상세 내용과 피드백 이력을 볼 수 있습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
