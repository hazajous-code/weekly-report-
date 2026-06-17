import { useState } from 'react'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import FeedbackTimeline from '../components/FeedbackTimeline'
import { STATUS, FEEDBACK_ACTION, ROLES, weekLabel } from '../data/constants'
import { userName } from '../data/mockData'

export default function TeamSummaryDetail() {
  const { currentUser, teamSummaries, reports, params, reviewTeamSummary, navigate, setToast } = useApp()
  const summary = teamSummaries.find((t) => t.id === params.summaryId)
  const [comment, setComment] = useState('')

  if (!summary) {
    return (
      <div className="empty-state">
        <div className="ico">🔍</div>
        <p>팀 요약을 찾을 수 없습니다.</p>
        <button className="btn mt12" onClick={() => navigate('manager-home')}>대시보드로</button>
      </div>
    )
  }

  const sourceReports = reports.filter((r) => (summary.reportIds || []).includes(r.id))
  const canReview = currentUser.role === ROLES.MANAGER && summary.status === STATUS.SUBMITTED

  const act = (action) => {
    if (action === FEEDBACK_ACTION.REJECT && !comment.trim()) {
      setToast('반려 시 사유를 입력해 주세요.')
      return
    }
    reviewTeamSummary(summary.id, action, comment.trim() || (action === FEEDBACK_ACTION.APPROVE ? '승인합니다.' : ''))
    setToast(action === FEEDBACK_ACTION.APPROVE ? '팀 요약을 승인했습니다.' : action === FEEDBACK_ACTION.REJECT ? '팀 요약을 반려했습니다.' : '코멘트를 남겼습니다.')
    navigate('manager-home')
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>팀 요약 검토</h1>
          <p className="sub">{summary.office} · {summary.team} · {weekLabel(summary.week)} · 팀장 {userName(summary.leadId)}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('manager-home')}>← 실 검토 대시보드</button>
      </div>

      <div className="grid-3">
        <div className="card card-pad">
          <div className="spread" style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: 18 }}>{summary.headline}</h2>
            <StatusBadge status={summary.status} />
          </div>
          <div className="detail-block"><div className="k">핵심 성과</div><div className="v">{summary.keyAchievements || '—'}</div></div>
          <div className="detail-block"><div className="k">주요 이슈 · 리스크</div><div className="v">{summary.issues || '—'}</div></div>
          <div className="detail-block">
            <div className="k">포함된 보고서 ({sourceReports.length})</div>
            <div className="v">
              {sourceReports.map((r) => (
                <div key={r.id} className="row" style={{ marginTop: 4 }}>
                  <span className="tag-team">{r.team}</span> {r.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stack">
          {canReview ? (
            <div className="card card-pad">
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>검토 의견</h3>
              <textarea className="textarea" placeholder="피드백 또는 반려 사유 (반려 시 필수)" value={comment} onChange={(e) => setComment(e.target.value)} />
              <div className="row mt12" style={{ gap: 8 }}>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={() => act(FEEDBACK_ACTION.APPROVE)}>✓ 승인</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => act(FEEDBACK_ACTION.REJECT)}>↩ 반려</button>
              </div>
            </div>
          ) : (
            <div className="card card-pad">
              <p className="muted" style={{ fontSize: 13 }}>
                {summary.status === STATUS.APPROVED && '승인된 팀 요약입니다. 실 요약에 반영하세요.'}
                {summary.status === STATUS.REJECTED && '반려된 팀 요약입니다. 팀장의 재제출을 기다립니다.'}
                {summary.status === STATUS.DRAFT && '아직 작성 중인 팀 요약입니다.'}
              </p>
            </div>
          )}

          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>피드백 이력</h3>
            <FeedbackTimeline history={summary.feedbackHistory} />
          </div>
        </div>
      </div>
    </div>
  )
}
