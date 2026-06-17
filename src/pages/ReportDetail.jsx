import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ReportView from '../components/ReportView'
import FeedbackTimeline from '../components/FeedbackTimeline'
import AISummaryPanel from '../components/AISummaryPanel'
import { STATUS, FEEDBACK_ACTION, ROLES } from '../data/constants'
import { summarizeSingle } from '../utils/aiSummary'

export default function ReportDetail() {
  const { currentUser, reports, params, reviewReport, navigate, setToast } = useApp()
  const report = reports.find((r) => r.id === params.reportId)
  const [comment, setComment] = useState('')
  const [ai, setAi] = useState(null)

  const back = currentUser.role === ROLES.TEAMLEAD ? 'teamlead-home' : 'feedback-history'

  if (!report) {
    return (
      <div className="empty-state">
        <div className="ico">🔍</div>
        <p>보고서를 찾을 수 없습니다.</p>
        <button className="btn mt12" onClick={() => navigate(back)}>대시보드로</button>
      </div>
    )
  }

  // 팀장만 1차 검토 가능
  const canReview = currentUser.role === ROLES.TEAMLEAD && report.status === STATUS.SUBMITTED

  const act = (action) => {
    if (action === FEEDBACK_ACTION.REJECT && !comment.trim()) {
      setToast('반려 시 사유를 입력해 주세요.')
      return
    }
    reviewReport(report.id, action, comment.trim() || (action === FEEDBACK_ACTION.APPROVE ? '승인합니다.' : ''))
    setToast(
      action === FEEDBACK_ACTION.APPROVE ? '보고서를 승인했습니다.' :
      action === FEEDBACK_ACTION.REJECT ? '보고서를 반려했습니다.' : '코멘트를 남겼습니다.',
    )
    navigate(back)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>보고서 상세 · 검토</h1>
          <p className="sub">팀장 1차 검토 — 승인 / 반려 / 피드백</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(back)}>← 돌아가기</button>
      </div>

      <div className="grid-3">
        <div className="card card-pad">
          <ReportView report={report} />
        </div>

        <div className="stack">
          {canReview ? (
            <div className="card card-pad">
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>검토 의견</h3>
              <textarea className="textarea" placeholder="피드백 또는 반려 사유를 입력하세요. (반려 시 필수)" value={comment} onChange={(e) => setComment(e.target.value)} />
              <div className="row mt12" style={{ gap: 8 }}>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={() => act(FEEDBACK_ACTION.APPROVE)}>✓ 승인</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => act(FEEDBACK_ACTION.REJECT)}>↩ 반려</button>
              </div>
              <button className="btn btn-block mt12" onClick={() => act(FEEDBACK_ACTION.COMMENT)} disabled={!comment.trim()}>💬 코멘트만 남기기</button>
            </div>
          ) : (
            <div className="card card-pad">
              <p className="muted" style={{ fontSize: 13 }}>
                {report.status === STATUS.APPROVED && '팀장이 승인한 보고서입니다.'}
                {report.status === STATUS.REJECTED && '반려된 보고서입니다. 작성자의 재제출을 기다립니다.'}
                {report.status === STATUS.DRAFT && '작성 중인 보고서입니다.'}
                {report.status === STATUS.SUBMITTED && currentUser.role !== ROLES.TEAMLEAD && '제출된 보고서입니다. (검토 권한은 팀장)'}
              </p>
            </div>
          )}

          <div className="card card-pad">
            <div className="spread" style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: 15 }}>🤖 AI 요약</h3>
              <button className="btn btn-sm" onClick={() => setAi(summarizeSingle(report))}>요약 생성</button>
            </div>
            {ai ? <AISummaryPanel summary={ai} scope="이 보고서" /> : <p className="muted" style={{ fontSize: 12.5 }}>버튼을 눌러 핵심 내용을 빠르게 확인하세요.</p>}
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>피드백 이력</h3>
            <FeedbackTimeline history={report.feedbackHistory} />
          </div>
        </div>
      </div>
    </div>
  )
}
