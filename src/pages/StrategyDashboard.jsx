import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { STATUS, weekLabel, SUBMIT_DEADLINE } from '../data/constants'
import { OFFICE_NAMES, USERS, userName } from '../data/mockData'

export default function StrategyDashboard() {
  const { reports, officeSummaries, week, navigate } = useApp()

  const employees = USERS.filter((u) => u.role === 'employee')
  const weekReports = reports.filter((r) => r.week === week)
  const isSubmitted = (r) => [STATUS.SUBMITTED, STATUS.APPROVED, STATUS.REJECTED].includes(r.status)
  const submittedReports = weekReports.filter(isSubmitted)
  const overallRate = employees.length ? Math.round((submittedReports.length / employees.length) * 100) : 0

  const weekOfficeSummaries = officeSummaries.filter((o) => o.week === week)
  const submittedOffices = weekOfficeSummaries.filter((o) => [STATUS.SUBMITTED, STATUS.EXEC_SUBMITTED].includes(o.status))

  // 지연 제출자
  const deadlinePassed = new Date() > new Date(SUBMIT_DEADLINE)
  const lateSubmitters = employees.filter((e) => {
    const r = weekReports.find((x) => x.authorId === e.id)
    return !r || r.status === STATUS.DRAFT
  })

  // 실별 현황
  const perOffice = OFFICE_NAMES.map((office) => {
    const os = weekOfficeSummaries.find((o) => o.office === office)
    const members = employees.filter((e) => e.office === office)
    const sub = weekReports.filter((r) => r.office === office && isSubmitted(r))
    return {
      office,
      members: members.length,
      submitted: sub.length,
      rate: members.length ? Math.round((sub.length / members.length) * 100) : 0,
      summaryStatus: os?.status || null,
    }
  })

  // 자동 분류 (실 요약 기반)
  const achievements = submittedOffices.filter((o) => o.keyAchievements?.trim())
  const issues = submittedOffices.filter((o) => o.issues?.trim())
  const decisions = submittedOffices.filter((o) => o.decisionsNeeded?.trim())

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>전략기획팀 취합 대시보드</h1>
          <p className="sub">{weekLabel(week)} · 실별 요약 취합 및 자동 분류</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('exec-summary-builder')}>🤖 임원 보고용 요약 생성 →</button>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="label">전체 제출률</div>
          <div className="value">{overallRate}<small>%</small></div>
          <div className="progress-bar"><span style={{ width: `${overallRate}%` }} /></div>
          <div className="trend">{submittedReports.length} / {employees.length}명</div>
        </div>
        <div className="stat">
          <div className="label">실 요약 제출</div>
          <div className="value pos">{submittedOffices.length}<small> / {OFFICE_NAMES.length}</small></div>
          <div className="trend">임원 보고 반영 대상</div>
        </div>
        <div className="stat">
          <div className="label">의사결정 필요</div>
          <div className="value accent">{decisions.length}<small> 건</small></div>
          <div className="trend">임원 확인 항목</div>
        </div>
        <div className="stat">
          <div className="label">지연 제출자</div>
          <div className="value" style={{ color: deadlinePassed && lateSubmitters.length ? 'var(--amber)' : 'inherit' }}>{lateSubmitters.length}<small> 명</small></div>
          <div className="trend">{deadlinePassed ? '마감 경과' : '마감 전'}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3>실별 제출 현황</h3></div>
          <table className="table">
            <thead><tr><th>실</th><th>보고 제출</th><th>제출률</th><th>실 요약</th></tr></thead>
            <tbody>
              {perOffice.map((t) => (
                <tr key={t.office}>
                  <td><strong>{t.office}</strong></td>
                  <td>{t.submitted} / {t.members}</td>
                  <td>
                    <div className="row">
                      <div className="progress-bar" style={{ width: 80, marginTop: 0 }}><span style={{ width: `${t.rate}%` }} /></div>
                      <span className="muted" style={{ fontSize: 12 }}>{t.rate}%</span>
                    </div>
                  </td>
                  <td>{t.summaryStatus ? <StatusBadge status={t.summaryStatus} /> : <span className="muted">미제출</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head"><h3>⏰ 지연 제출자</h3></div>
          <div className="card-pad">
            {lateSubmitters.length === 0 ? (
              <p className="muted" style={{ fontSize: 13 }}>모든 담당자가 제출을 완료했습니다. 👍</p>
            ) : (
              <div className="pill-list">
                {lateSubmitters.map((e) => (
                  <span key={e.id} className="badge badge-amber"><span className="dot" />{e.name} · {e.team}</span>
                ))}
              </div>
            )}
            <p className="muted mt12" style={{ fontSize: 12 }}>운영 시 마감 미제출자에게 자동 알림(메일/메신저)을 발송하도록 확장할 수 있습니다.</p>
          </div>
        </div>
      </div>

      <div className="grid-2 mt18">
        <div className="card">
          <div className="card-head"><h3>🏆 핵심 성과 (실별 자동 분류)</h3></div>
          <div className="card-pad">
            {achievements.length ? achievements.map((o) => (
              <div key={o.id} className="detail-block">
                <span className="tag-team">{o.office}</span>
                <div className="v mt12" style={{ fontSize: 13.5 }}>{o.keyAchievements}</div>
              </div>
            )) : <p className="muted" style={{ fontSize: 13 }}>제출된 실 요약이 없습니다.</p>}
          </div>
        </div>
        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>⚠️ 주요 이슈 · 리스크</h3></div>
            <div className="card-pad">
              {issues.length ? issues.map((o) => (
                <div key={o.id} className="detail-block">
                  <span className="tag-team">{o.office}</span>
                  <div className="v mt12" style={{ fontSize: 13.5 }}>{o.issues}</div>
                </div>
              )) : <p className="muted" style={{ fontSize: 13 }}>보고된 이슈가 없습니다.</p>}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>👔 임원 의사결정 필요</h3></div>
            <div className="card-pad">
              {decisions.length ? decisions.map((o) => (
                <div key={o.id} className="detail-block">
                  <span className="tag-team">{o.office}</span>
                  <div className="v mt12" style={{ fontSize: 13.5 }}>{o.decisionsNeeded}</div>
                </div>
              )) : <p className="muted" style={{ fontSize: 13 }}>해당 항목이 없습니다.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
