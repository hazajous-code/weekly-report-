import { useState } from 'react'
import { useApp } from '../context/AppContext'
import AISummaryPanel from '../components/AISummaryPanel'
import StatusBadge from '../components/StatusBadge'
import FeedbackTimeline from '../components/FeedbackTimeline'
import { STATUS, weekLabel } from '../data/constants'
import { summarizeReports } from '../utils/aiSummary'

export default function TeamSummary() {
  const { currentUser, reports, teamSummaries, week, saveTeamSummary, navigate, setToast } = useApp()

  const approved = reports.filter(
    (r) => r.team === currentUser.team && r.week === week && r.status === STATUS.APPROVED,
  )
  const existing = teamSummaries.find((t) => t.team === currentUser.team && t.week === week)

  const [headline, setHeadline] = useState(existing?.headline || `${currentUser.team} 주간 업무 요약`)
  const [keyAchievements, setKey] = useState(existing?.keyAchievements || '')
  const [issues, setIssues] = useState(existing?.issues || '')
  const [ai, setAi] = useState(null)

  const payload = (status) => ({
    id: existing?.id,
    week,
    team: currentUser.team,
    office: currentUser.office,
    leadId: currentUser.id,
    reportIds: approved.map((r) => r.id),
    headline,
    keyAchievements,
    issues,
    status,
  })

  const generate = () => {
    const summary = summarizeReports(approved, { teamName: currentUser.team })
    setAi(summary)
    setKey(summary.keyAchievements.join('\n'))
    setIssues(summary.majorIssues.join('\n') || '특이사항 없음')
    setToast('AI 요약을 생성해 입력란에 반영했습니다.')
  }

  const saveDraft = () => {
    saveTeamSummary(payload(STATUS.DRAFT))
    setToast('팀 요약을 임시저장했습니다.')
    navigate('teamlead-home')
  }
  const submit = () => {
    saveTeamSummary(payload(STATUS.SUBMITTED), { submit: true })
    setToast('팀 요약을 실장에게 제출했습니다.')
    navigate('teamlead-home')
  }

  const rejected = existing?.status === STATUS.REJECTED

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>팀 요약 작성 — {currentUser.team}</h1>
          <p className="sub">{currentUser.office} · {weekLabel(week)} · 승인된 보고 {approved.length}건을 묶어 실장에게 보고합니다.</p>
        </div>
        {existing && <StatusBadge status={existing.status} />}
      </div>

      {rejected && (
        <div className="card card-pad" style={{ marginBottom: 18, borderColor: 'var(--red)' }}>
          <div className="alert alert-warn" style={{ marginBottom: 12 }}>
            <span>↩</span>
            <div><strong>실장이 팀 요약을 반려했습니다.</strong> 아래 피드백을 반영해 보완 후 재제출하세요.</div>
          </div>
          <FeedbackTimeline history={existing.feedbackHistory} />
        </div>
      )}

      {approved.length === 0 && (
        <div className="alert alert-warn" style={{ marginBottom: 18 }}>
          <span>⚠️</span>
          <div>아직 승인된 보고서가 없습니다. 먼저 팀원 보고서를 검토·승인해 주세요.</div>
        </div>
      )}

      <div className="grid-3">
        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>승인된 보고서 ({approved.length})</h3></div>
            <div className="card-pad">
              {approved.length === 0 ? (
                <p className="muted" style={{ fontSize: 13 }}>승인된 보고서가 없습니다.</p>
              ) : (
                approved.map((r) => (
                  <div key={r.id} className="detail-block">
                    <div className="spread"><strong>{r.title}</strong><StatusBadge status={r.status} /></div>
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{r.quantitativeValue}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card card-pad">
            <div className="form-grid">
              <div className="field">
                <label>요약 헤드라인</label>
                <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} />
              </div>
              <div className="field">
                <label>핵심 성과</label>
                <textarea className="textarea" style={{ minHeight: 120 }} value={keyAchievements} onChange={(e) => setKey(e.target.value)} />
              </div>
              <div className="field">
                <label>주요 이슈 · 리스크</label>
                <textarea className="textarea" value={issues} onChange={(e) => setIssues(e.target.value)} />
              </div>
              <div className="form-actions">
                <button className="btn" onClick={saveDraft}>💾 임시저장</button>
                <button className="btn btn-primary" onClick={submit} disabled={approved.length === 0}>📤 실장에게 제출</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 15, marginBottom: 10 }}>🤖 AI 자동 요약</h3>
          <p className="muted" style={{ fontSize: 12.5, marginBottom: 12 }}>승인된 보고서를 취합해 핵심 성과·이슈를 자동 정리합니다.</p>
          <button className="btn btn-primary btn-block" onClick={generate} disabled={approved.length === 0}>승인 보고 일괄 요약</button>
          {ai && <div className="mt18"><AISummaryPanel summary={ai} /></div>}
        </div>
      </div>
    </div>
  )
}
