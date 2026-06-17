import { useState } from 'react'
import { useApp } from '../context/AppContext'
import AISummaryPanel from '../components/AISummaryPanel'
import FeedbackTimeline from '../components/FeedbackTimeline'
import { STATUS, WEEKS } from '../data/constants'
import { summarizeSingle } from '../utils/aiSummary'

const BLANK = {
  title: '',
  progress: '',
  quantitativeValue: '',
  qualitativeValue: '',
  issues: '',
  nextPlan: '',
  supportNeeded: '',
}

export default function ReportEditor() {
  const { currentUser, reports, week, params, saveDraft, submitReport, navigate, setToast } = useApp()

  const existing = params.reportId ? reports.find((r) => r.id === params.reportId) : null
  const [form, setForm] = useState(() =>
    existing
      ? { ...existing }
      : { ...BLANK, week, team: currentUser.team, office: currentUser.office, authorId: currentUser.id },
  )
  const [aiPreview, setAiPreview] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const canSubmit = form.title.trim() && form.progress.trim()
  const readOnly = existing && [STATUS.APPROVED, STATUS.SUBMITTED].includes(existing.status)

  const withOrg = (f) => ({ ...f, authorId: currentUser.id, team: currentUser.team, office: currentUser.office })
  const handleDraft = () => {
    saveDraft(withOrg(form))
    setToast('임시저장되었습니다.')
    navigate('employee-home')
  }
  const handleSubmit = () => {
    if (!canSubmit) return
    submitReport(withOrg(form))
    setToast('보고서가 제출되었습니다. 팀장 검토를 기다립니다.')
    navigate('employee-home')
  }
  const runAi = () => {
    setAiLoading(true)
    // Mock: 짧은 지연 후 요약 결과 표시
    setTimeout(() => {
      setAiPreview(summarizeSingle(form))
      setAiLoading(false)
    }, 600)
  }

  const rejectedFeedback =
    existing?.status === STATUS.REJECTED ? existing.feedbackHistory : null

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{existing ? '주간보고 수정' : '주간보고 작성'}</h1>
          <p className="sub">진행 업무, 성과, 이슈, 계획을 입력하고 제출하세요.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('employee-home')}>
          ← 대시보드로
        </button>
      </div>

      {rejectedFeedback && (
        <div className="card card-pad" style={{ marginBottom: 18, borderColor: 'var(--red)' }}>
          <div className="alert alert-warn" style={{ marginBottom: 12 }}>
            <span>↩️</span>
            <div><strong>이 보고서는 반려되었습니다.</strong> 아래 팀장 피드백을 반영해 보완 후 재제출하세요.</div>
          </div>
          <FeedbackTimeline history={rejectedFeedback} />
        </div>
      )}

      {readOnly && (
        <div className="alert alert-info" style={{ marginBottom: 18 }}>
          <span>🔒</span>
          <div>제출/승인된 보고서는 보기 전용입니다. 수정이 필요하면 팀장에게 반려를 요청하세요.</div>
        </div>
      )}

      <div className="grid-3">
        <div className="card card-pad">
          <div className="form-grid">
            <div className="two-col">
              <div className="field">
                <label>보고 주차<span className="req">*</span></label>
                <select className="input" value={form.week} onChange={set('week')} disabled={readOnly}>
                  {WEEKS.map((w) => (
                    <option key={w.key} value={w.key}>{w.label} ({w.range})</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>소속</label>
                <input className="input" value={`${currentUser.office} · ${currentUser.team}`} disabled />
              </div>
            </div>

            <div className="field">
              <label>프로젝트 / 업무명<span className="req">*</span></label>
              <input
                className="input"
                placeholder="예) 그룹 통합포털 UX 개편"
                value={form.title}
                onChange={set('title')}
                disabled={readOnly}
              />
            </div>

            <div className="field">
              <label>주요 진행 내용<span className="req">*</span></label>
              <textarea className="textarea" value={form.progress} onChange={set('progress')} disabled={readOnly}
                placeholder="이번 주 실제로 진행한 업무를 구체적으로 작성하세요." />
            </div>

            <div className="two-col">
              <div className="field">
                <label>정량 성과 <span className="hint">수치 중심</span></label>
                <textarea className="textarea" value={form.quantitativeValue} onChange={set('quantitativeValue')} disabled={readOnly}
                  placeholder="예) 정확도 87%→93%, 처리 건수 1.5만 건" />
              </div>
              <div className="field">
                <label>정성 성과 <span className="hint">질적 변화</span></label>
                <textarea className="textarea" value={form.qualitativeValue} onChange={set('qualitativeValue')} disabled={readOnly}
                  placeholder="예) 프로세스 정립, 협업 체계 확립" />
              </div>
            </div>

            <div className="field">
              <label>이슈 및 리스크</label>
              <textarea className="textarea" value={form.issues} onChange={set('issues')} disabled={readOnly}
                placeholder="진행 중 발생한 문제, 잠재 리스크와 영향도" />
            </div>

            <div className="two-col">
              <div className="field">
                <label>다음 주 계획</label>
                <textarea className="textarea" value={form.nextPlan} onChange={set('nextPlan')} disabled={readOnly} />
              </div>
              <div className="field">
                <label>지원 요청 사항</label>
                <textarea className="textarea" value={form.supportNeeded} onChange={set('supportNeeded')} disabled={readOnly}
                  placeholder="타 부서 협조, 의사결정 필요 사항 등" />
              </div>
            </div>

            {!readOnly && (
              <div className="form-actions">
                <button className="btn" onClick={handleDraft}>💾 임시저장</button>
                <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
                  📤 제출하기
                </button>
              </div>
            )}
            {!canSubmit && !readOnly && (
              <p className="muted" style={{ fontSize: 12, textAlign: 'right' }}>
                * 업무명과 주요 진행 내용은 필수입니다.
              </p>
            )}
          </div>
        </div>

        <div className="stack">
          <div className="card card-pad">
            <div className="spread" style={{ marginBottom: 6 }}>
              <h3 style={{ fontSize: 14 }}>🤖 AI 요약 미리보기</h3>
            </div>
            <p className="muted" style={{ fontSize: 12.5, marginBottom: 12 }}>
              작성 중인 내용을 4개 섹션으로 자동 정리합니다 (Mock).
            </p>
            <button className="btn btn-primary btn-block" onClick={runAi} disabled={aiLoading || !form.progress.trim()}>
              {aiLoading ? '요약 생성 중…' : 'AI로 요약 생성'}
            </button>
            {aiPreview && (
              <div className="mt18">
                <AISummaryPanel summary={aiPreview} scope="작성 중인 보고서" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
