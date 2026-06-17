import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { STATUS, weekLabel } from '../data/constants'
import { teamsOfOffice, userName } from '../data/mockData'

export default function ManagerDashboard() {
  const { currentUser, reports, teamSummaries, week, navigate } = useApp()

  const teams = teamsOfOffice(currentUser.office)
  const officeSummaries = teamSummaries.filter((t) => t.office === currentUser.office && t.week === week)
  const summaryByTeam = (team) => officeSummaries.find((t) => t.team === team)

  const submitted = officeSummaries.filter((t) => [STATUS.SUBMITTED, STATUS.APPROVED, STATUS.REJECTED].includes(t.status))
  const approved = officeSummaries.filter((t) => t.status === STATUS.APPROVED)
  const pending = officeSummaries.filter((t) => t.status === STATUS.SUBMITTED)

  // 실 전체 보고 통계
  const officeReports = reports.filter((r) => r.office === currentUser.office && r.week === week)
  const reportsApproved = officeReports.filter((r) => r.status === STATUS.APPROVED).length

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{currentUser.office} 검토 대시보드</h1>
          <p className="sub">{weekLabel(week)} · 팀장이 제출한 팀 요약 {teams.length}개 팀 검토</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('office-summary')}>🏢 실 요약 작성하기</button>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="label">팀 요약 제출</div>
          <div className="value">{submitted.length}<small> / {teams.length}</small></div>
          <div className="trend">팀장 제출 현황</div>
        </div>
        <div className="stat">
          <div className="label">검토 대기</div>
          <div className="value accent">{pending.length}<small> 건</small></div>
          <div className="trend">승인/반려 필요</div>
        </div>
        <div className="stat">
          <div className="label">승인 완료</div>
          <div className="value pos">{approved.length}<small> 건</small></div>
          <div className="trend">실 요약 대상</div>
        </div>
        <div className="stat">
          <div className="label">실 전체 승인 보고</div>
          <div className="value">{reportsApproved}<small> 건</small></div>
          <div className="trend">팀장 1차 승인 누적</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>팀별 요약 제출 현황</h3>
          <span className="muted" style={{ fontSize: 12.5 }}>행을 클릭하면 검토 화면으로 이동합니다</span>
        </div>
        <table className="table">
          <thead>
            <tr><th>팀</th><th>헤드라인</th><th>팀장</th><th>상태</th><th></th></tr>
          </thead>
          <tbody>
            {teams.map((team) => {
              const s = summaryByTeam(team)
              return (
                <tr key={team} className={s ? 'clickable' : ''} onClick={() => s && navigate('team-summary-detail', { summaryId: s.id })}>
                  <td><strong>{team}</strong></td>
                  <td>{s ? s.headline : <span className="muted">미제출</span>}</td>
                  <td className="muted">{s ? userName(s.leadId) : '—'}</td>
                  <td>{s ? <StatusBadge status={s.status} /> : <span className="badge badge-amber"><span className="dot" />미제출</span>}</td>
                  <td className="muted">{s ? '검토 →' : ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pending.length > 0 && (
        <div className="alert alert-info mt18">
          <span>📌</span>
          <div>검토 대기 중인 팀 요약이 <strong>{pending.length}건</strong> 있습니다. 승인 후 실 요약을 작성하세요.</div>
        </div>
      )}
    </div>
  )
}
