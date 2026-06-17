import { useState } from 'react'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { STATUS, weekLabel } from '../data/constants'

export default function ExecSummaryBuilder() {
  const { currentUser, officeSummaries, execSummaries, week, saveExecSummary, navigate, setToast } = useApp()

  const existing = execSummaries.find((e) => e.week === week)
  const sources = officeSummaries.filter(
    (o) => o.week === week && [STATUS.SUBMITTED, STATUS.EXEC_SUBMITTED].includes(o.status),
  )

  const [form, setForm] = useState(() => ({
    keyAchievements: existing?.keyAchievements || '',
    majorIssues: existing?.majorIssues || '',
    risks: existing?.risks || '',
    decisionsNeeded: existing?.decisionsNeeded || '',
  }))
  const [generated, setGenerated] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const join = (fn) => sources.map(fn).filter((x) => x && x.trim()).join('\n')

  const generate = () => {
    setForm({
      keyAchievements: join((o) => `· [${o.office}] ${o.keyAchievements}`),
      majorIssues: join((o) => o.issues && `· [${o.office}] ${o.issues}`),
      risks: join((o) => o.issues && `· [${o.office}] ${o.issues}`),
      decisionsNeeded: join((o) => o.decisionsNeeded && `· [${o.office}] ${o.decisionsNeeded}`),
    })
    setGenerated(true)
    setToast('AI가 실별 요약을 취합해 임원 보고 초안을 생성했습니다.')
  }

  const submit = () => {
    saveExecSummary({
      id: existing?.id,
      week,
      authorId: currentUser.id,
      ...form,
      status: STATUS.EXEC_SUBMITTED,
      execComments: existing?.execComments || [],
    })
    setToast('임원 보고용 요약본을 제출했습니다.')
    navigate('strategy-home')
  }

  const FIELDS = [
    { key: 'keyAchievements', label: '🏆 핵심 성과', rows: 6 },
    { key: 'majorIssues', label: '⚠️ 주요 이슈', rows: 4 },
    { key: 'risks', label: '🚧 리스크', rows: 4 },
    { key: 'decisionsNeeded', label: '👔 임원 확인 / 의사결정 필요', rows: 4 },
  ]

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>임원 보고용 요약 생성</h1>
          <p className="sub">{weekLabel(week)} · 제출된 실 요약 {sources.length}건 기반 최종 요약본</p>
        </div>
        <div className="row">
          {existing && <StatusBadge status={existing.status} />}
          <button className="btn btn-ghost" onClick={() => navigate('strategy-home')}>← 취합 대시보드</button>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 18 }}>
        <span>🤖</span>
        <div><strong>AI 자동 생성</strong> 버튼을 누르면 각 실(室)의 요약을 취합해 4개 섹션 초안을 만들어 줍니다. 검토·수정 후 제출하면 임원 화면에 노출됩니다.</div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <button className="btn btn-primary" onClick={generate} disabled={sources.length === 0}>✨ AI로 임원 보고 초안 생성</button>
        {generated && <span className="muted" style={{ marginLeft: 12, fontSize: 13 }}>초안이 아래 입력란에 반영되었습니다.</span>}
        {sources.length === 0 && <span className="muted" style={{ marginLeft: 12, fontSize: 13 }}>제출된 실 요약이 없습니다.</span>}
      </div>

      <div className="card card-pad">
        <div className="form-grid">
          {FIELDS.map((f) => (
            <div className="field" key={f.key}>
              <label>{f.label}</label>
              <textarea className="textarea" style={{ minHeight: f.rows * 22 }} value={form[f.key]} onChange={set(f.key)} placeholder="AI 생성 또는 직접 입력" />
            </div>
          ))}
          <div className="form-actions">
            <button className="btn" onClick={() => navigate('strategy-home')}>취소</button>
            <button className="btn btn-primary" onClick={submit}>📤 임원 보고 제출</button>
          </div>
        </div>
      </div>
    </div>
  )
}
