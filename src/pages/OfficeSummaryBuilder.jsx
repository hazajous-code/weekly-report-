import { useState } from 'react'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { STATUS, weekLabel } from '../data/constants'

export default function OfficeSummaryBuilder() {
  const { currentUser, teamSummaries, officeSummaries, week, saveOfficeSummary, navigate, setToast } = useApp()

  const approvedTeams = teamSummaries.filter(
    (t) => t.office === currentUser.office && t.week === week && t.status === STATUS.APPROVED,
  )
  const existing = officeSummaries.find((o) => o.office === currentUser.office && o.week === week)

  const [form, setForm] = useState(() => ({
    headline: existing?.headline || `${currentUser.office} 주간 업무 요약`,
    keyAchievements: existing?.keyAchievements || '',
    issues: existing?.issues || '',
    decisionsNeeded: existing?.decisionsNeeded || '',
  }))
  const [generated, setGenerated] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const generate = () => {
    const key = approvedTeams.map((t) => `· [${t.team}] ${t.keyAchievements}`).join('\n')
    const iss = approvedTeams.map((t) => t.issues).filter((x) => x && x !== '특이사항 없음').map((x) => `· ${x}`).join('\n')
    setForm((f) => ({
      ...f,
      keyAchievements: key,
      issues: iss || '· 특이 리스크 없음',
    }))
    setGenerated(true)
    setToast('승인된 팀 요약을 취합해 실 요약 초안을 생성했습니다.')
  }

  const payload = (status) => ({
    id: existing?.id,
    week,
    office: currentUser.office,
    managerId: currentUser.id,
    teamSummaryIds: approvedTeams.map((t) => t.id),
    ...form,
    status,
  })

  const submit = () => {
    saveOfficeSummary(payload(STATUS.SUBMITTED))
    setToast('실 요약을 전략기획팀에 제출했습니다.')
    navigate('manager-home')
  }
  const saveDraft = () => {
    saveOfficeSummary(payload(STATUS.DRAFT))
    setToast('실 요약을 임시저장했습니다.')
    navigate('manager-home')
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>실 요약 작성 — {currentUser.office}</h1>
          <p className="sub">{weekLabel(week)} · 승인된 팀 요약 {approvedTeams.length}건 기반</p>
        </div>
        {existing && <StatusBadge status={existing.status} />}
      </div>

      {approvedTeams.length === 0 && (
        <div className="alert alert-warn" style={{ marginBottom: 18 }}>
          <span>⚠️</span>
          <div>승인된 팀 요약이 없습니다. 먼저 팀 요약을 검토·승인해 주세요.</div>
        </div>
      )}

      <div className="grid-3">
        <div className="card card-pad">
          <div className="form-grid">
            <div className="field">
              <label>실 요약 헤드라인</label>
              <input className="input" value={form.headline} onChange={set('headline')} />
            </div>
            <div className="field">
              <label>핵심 성과</label>
              <textarea className="textarea" style={{ minHeight: 130 }} value={form.keyAchievements} onChange={set('keyAchievements')} />
            </div>
            <div className="field">
              <label>주요 이슈 · 리스크</label>
              <textarea className="textarea" value={form.issues} onChange={set('issues')} />
            </div>
            <div className="field">
              <label>임원 의사결정 필요 사항</label>
              <textarea className="textarea" value={form.decisionsNeeded} onChange={set('decisionsNeeded')} placeholder="예) 예산 승인, 인력 충원, 부서 간 협조 등" />
            </div>
            <div className="form-actions">
              <button className="btn" onClick={saveDraft}>💾 임시저장</button>
              <button className="btn btn-primary" onClick={submit} disabled={approvedTeams.length === 0}>📤 전략기획팀에 제출</button>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 10 }}>🤖 AI 자동 취합</h3>
            <p className="muted" style={{ fontSize: 12.5, marginBottom: 12 }}>승인된 팀 요약을 묶어 실 단위 초안을 생성합니다.</p>
            <button className="btn btn-primary btn-block" onClick={generate} disabled={approvedTeams.length === 0}>팀 요약 일괄 취합</button>
            {generated && <p className="muted mt12" style={{ fontSize: 12 }}>초안이 입력란에 반영되었습니다.</p>}
          </div>

          <div className="card">
            <div className="card-head"><h3>승인된 팀 요약 ({approvedTeams.length})</h3></div>
            <div className="card-pad">
              {approvedTeams.length === 0 ? (
                <p className="muted" style={{ fontSize: 13 }}>없음</p>
              ) : approvedTeams.map((t) => (
                <div key={t.id} className="detail-block">
                  <span className="tag-team">{t.team}</span>
                  <div className="v mt12" style={{ fontSize: 13.5 }}>{t.headline}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
