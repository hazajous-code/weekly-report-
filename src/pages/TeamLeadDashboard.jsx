import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { STATUS, weekLabel } from '../data/constants'
import { USERS } from '../data/mockData'

export default function TeamLeadDashboard() {
  const { currentUser, reports, week, navigate } = useApp()

  // 본인 팀 소속 현업 담당자
  const members = USERS.filter((u) => u.role === 'employee' && u.team === currentUser.team)
  const teamReports = reports.filter((r) => r.team === currentUser.team && r.week === week)
  const reportByAuthor = (id) => teamReports.find((r) => r.authorId === id)

  const submitted = teamReports.filter((r) => [STATUS.SUBMITTED, STATUS.APPROVED, STATUS.REJECTED].includes(r.status))
  const approved = teamReports.filter((r) => r.status === STATUS.APPROVED)
  const pending = teamReports.filter((r) => r.status === STATUS.SUBMITTED)
  const rejected = teamReports.filter((r) => r.status === STATUS.REJECTED)
  const rate = members.length ? Math.round((submitted.length / members.length) * 100) : 0

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{currentUser.team} 검토 대시보드</h1>
          <p className="sub">{currentUser.office} · {weekLabel(week)} · 팀원 {members.length}명의 주간보고 1차 검토</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('team-summary')}>🧩 팀 요약 작성하기</button>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="label">제출률</div>
          <div className="value">{rate}<small>%</small></div>
          <div className="progress-bar"><span style={{ width: `${rate}%` }} /></div>
          <div className="trend">{submitted.length} / {members.length}명 제출</div>
        </div>
        <div className="stat">
          <div className="label">검토 대기</div>
          <div className="value accent">{pending.length}<small> 건</small></div>
          <div className="trend">승인/반려 필요</div>
        </div>
        <div className="stat">
          <div className="label">승인 완료</div>
          <div className="value pos">{approved.length}<small> 건</small></div>
          <div className="trend">팀 요약 대상</div>
        </div>
        <div className="stat">
          <div className="label">반려</div>
          <div className="value neg">{rejected.length}<small> 건</small></div>
          <div className="trend">재제출 대기</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>팀원별 제출 현황</h3>
          <span className="muted" style={{ fontSize: 12.5 }}>행을 클릭하면 상세·검토 화면으로 이동합니다</span>
        </div>
        <table className="table">
          <thead>
            <tr><th>담당자</th><th>보고 제목</th><th>정량 성과</th><th>상태</th><th></th></tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const r = reportByAuthor(m.id)
              return (
                <tr key={m.id} className={r ? 'clickable' : ''} onClick={() => r && navigate('report-detail', { reportId: r.id })}>
                  <td>
                    <div className="row">
                      <span className="avatar sm">{m.name[0]}</span>
                      {m.name}
                    </div>
                  </td>
                  <td>{r ? r.title : <span className="muted">미작성</span>}</td>
                  <td className="muted" style={{ maxWidth: 240 }}>{r?.quantitativeValue?.trim() ? r.quantitativeValue : '—'}</td>
                  <td>{r ? <StatusBadge status={r.status} /> : <span className="badge badge-amber"><span className="dot" />미제출</span>}</td>
                  <td className="muted">{r ? '검토 →' : ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pending.length > 0 && (
        <div className="alert alert-info mt18">
          <span>📌</span>
          <div>검토 대기 중인 보고서가 <strong>{pending.length}건</strong> 있습니다. 승인 또는 반려를 진행해 주세요.</div>
        </div>
      )}
    </div>
  )
}
