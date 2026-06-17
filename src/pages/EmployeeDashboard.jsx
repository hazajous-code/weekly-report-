import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { STATUS, weekLabel, SUBMIT_DEADLINE } from '../data/constants'

export default function EmployeeDashboard() {
  const { currentUser, reports, week, navigate } = useApp()

  const mine = reports.filter((r) => r.authorId === currentUser.id)
  const thisWeek = mine.filter((r) => r.week === week)
  const current = thisWeek[0]

  const counts = {
    total: mine.length,
    approved: mine.filter((r) => r.status === STATUS.APPROVED).length,
    rejected: mine.filter((r) => r.status === STATUS.REJECTED).length,
    pending: mine.filter((r) => r.status === STATUS.SUBMITTED).length,
  }

  const deadlinePassed = new Date() > new Date(SUBMIT_DEADLINE)
  const notSubmittedThisWeek = !current || current.status === STATUS.DRAFT

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>안녕하세요, {currentUser.name}님 👋</h1>
          <p className="sub">
            {currentUser.team} · 이번 보고 주차: <strong>{weekLabel(week)}</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('report-editor')}>
          ✍️ 이번 주 보고 작성
        </button>
      </div>

      {deadlinePassed && notSubmittedThisWeek && (
        <div className="alert alert-warn" style={{ marginBottom: 20 }}>
          <span>⏰</span>
          <div>
            <strong>제출 마감이 지났습니다.</strong> 이번 주 보고서가 아직 제출되지 않았어요. 빠르게 작성/제출해 주세요.
          </div>
        </div>
      )}

      <div className="stat-grid">
        <div className="stat">
          <div className="label">누적 작성 보고</div>
          <div className="value">{counts.total}<small> 건</small></div>
        </div>
        <div className="stat">
          <div className="label">승인 완료</div>
          <div className="value" style={{ color: 'var(--green)' }}>{counts.approved}<small> 건</small></div>
        </div>
        <div className="stat">
          <div className="label">검토 대기</div>
          <div className="value" style={{ color: 'var(--blue)' }}>{counts.pending}<small> 건</small></div>
        </div>
        <div className="stat">
          <div className="label">반려 (보완 필요)</div>
          <div className="value" style={{ color: 'var(--red)' }}>{counts.rejected}<small> 건</small></div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>이번 주차 ({weekLabel(week)}) 내 보고서</h3>
        </div>
        <div className="card-pad">
          {thisWeek.length === 0 ? (
            <div className="empty-state">
              <div className="ico">📝</div>
              <p>이번 주 작성한 보고서가 없습니다.</p>
              <button className="btn btn-primary mt12" onClick={() => navigate('report-editor')}>
                새 보고서 작성
              </button>
            </div>
          ) : (
            thisWeek.map((r) => (
              <div className="spread" key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div className="row">
                    <strong>{r.title}</strong>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                    최근 수정 {new Date(r.updatedAt).toLocaleString('ko-KR')}
                  </div>
                  {r.status === STATUS.REJECTED && (
                    <div className="alert alert-warn mt12">
                      <span>↩️</span>
                      <div>
                        반려되었습니다. 팀장 피드백을 확인하고 보완 후 재제출하세요.
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <button className="btn btn-sm" onClick={() => navigate('feedback-history', { reportId: r.id })}>
                    이력 보기
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate('report-editor', { reportId: r.id })}
                  >
                    {r.status === STATUS.REJECTED ? '보완 · 재제출' : r.status === STATUS.DRAFT ? '이어서 작성' : '보기 · 수정'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {mine.some((r) => r.week !== week) && (
        <div className="card mt18">
          <div className="card-head">
            <h3>지난 보고 이력</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>주차</th>
                <th>제목</th>
                <th>상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mine
                .filter((r) => r.week !== week)
                .map((r) => (
                  <tr key={r.id} className="clickable" onClick={() => navigate('feedback-history', { reportId: r.id })}>
                    <td>{weekLabel(r.week)}</td>
                    <td>{r.title}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="muted">이력 보기 →</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
