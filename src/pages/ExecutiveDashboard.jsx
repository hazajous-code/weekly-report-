import { useState } from 'react'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { STATUS, weekLabel } from '../data/constants'
import { OFFICE_NAMES, userName } from '../data/mockData'

function Section({ icon, title, text }) {
  return (
    <div className="card">
      <div className="card-head"><h3>{icon} {title}</h3></div>
      <div className="card-pad">
        {text?.trim() ? <div className="v" style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{text}</div> : <p className="muted" style={{ fontSize: 13 }}>해당 없음</p>}
      </div>
    </div>
  )
}

export default function ExecutiveDashboard() {
  const { reports, execSummaries, week, addExecComment, setToast } = useApp()
  const [comment, setComment] = useState('')

  const summary = execSummaries.find((e) => e.week === week)
  const approved = reports.filter((r) => r.week === week && r.status === STATUS.APPROVED)

  const perOffice = OFFICE_NAMES.map((office) => ({
    office,
    items: approved.filter((r) => r.office === office),
  })).filter((t) => t.items.length)

  const submit = () => {
    if (!comment.trim() || !summary) return
    addExecComment(summary.id, comment.trim())
    setComment('')
    setToast('코멘트를 등록했습니다.')
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>임원 주간보고 — {weekLabel(week)}</h1>
          <p className="sub">전략기획팀이 취합한 최종 보고입니다.</p>
        </div>
        {summary && <StatusBadge status={summary.status} />}
      </div>

      {!summary ? (
        <div className="empty-state">
          <div className="ico">🗂️</div>
          <p>이번 주차의 임원 보고 요약이 아직 제출되지 않았습니다.</p>
          <p className="muted" style={{ fontSize: 13 }}>전략기획팀의 취합 완료를 기다려 주세요.</p>
        </div>
      ) : (
        <>
          <div className="grid-2">
            <Section icon="🏆" title="핵심 성과" text={summary.keyAchievements} />
            <Section icon="⚠️" title="주요 이슈" text={summary.majorIssues} />
            <Section icon="🚧" title="리스크" text={summary.risks} />
            <Section icon="👔" title="의사결정 필요 사항" text={summary.decisionsNeeded} />
          </div>

          <div className="card mt18">
            <div className="card-head"><h3>실(室)별 주요 성과</h3></div>
            <table className="table">
              <thead><tr><th>실</th><th>프로젝트</th><th>성과</th></tr></thead>
              <tbody>
                {perOffice.length === 0 && <tr><td colSpan={3} className="muted">승인된 보고가 없습니다.</td></tr>}
                {perOffice.flatMap((t) =>
                  t.items.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{t.office}</strong></td>
                      <td>{r.title}</td>
                      <td className="muted">{r.quantitativeValue || r.qualitativeValue}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>

          <div className="card mt18">
            <div className="card-head"><h3>💬 임원 코멘트</h3></div>
            <div className="card-pad">
              {(summary.execComments || []).length === 0 ? (
                <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>아직 등록된 코멘트가 없습니다.</p>
              ) : (
                <div className="timeline" style={{ marginBottom: 16 }}>
                  {summary.execComments.map((c) => (
                    <div className="tl-item" key={c.id}>
                      <span className="tl-dot" />
                      <div className="tl-head">
                        <strong>{userName(c.writerId)}</strong>
                        <span className="tl-time">{new Date(c.createdAt).toLocaleString('ko-KR')}</span>
                      </div>
                      <div className="tl-body">{c.comment}</div>
                    </div>
                  ))}
                </div>
              )}
              <textarea className="textarea" placeholder="의사결정, 지시사항 또는 피드백을 남기세요." value={comment} onChange={(e) => setComment(e.target.value)} />
              <div className="form-actions">
                <button className="btn btn-primary" onClick={submit} disabled={!comment.trim()}>코멘트 등록</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
