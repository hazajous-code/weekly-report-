// Mock AI 요약 결과를 4개 섹션으로 표시하는 패널
const SECTIONS = [
  { key: 'keyAchievements', icon: '🏆', title: '핵심 성과' },
  { key: 'majorIssues', icon: '⚠️', title: '주요 이슈' },
  { key: 'nextFocus', icon: '🎯', title: '다음 주 중점 사항' },
  { key: 'execAttention', icon: '👔', title: '임원 확인 필요 사항' },
]

export default function AISummaryPanel({ summary, scope }) {
  if (!summary) return null
  return (
    <div className="ai-panel">
      <div className="ai-head">
        <span>🤖</span>
        AI 요약
        <span className="ai-tag">Mock AI</span>
      </div>
      <p className="muted" style={{ fontSize: 12.5 }}>
        {scope || summary.scope} 기준 자동 생성 결과입니다.
      </p>
      {SECTIONS.map((s) => {
        const items = summary[s.key] || []
        return (
          <div className="ai-section" key={s.key}>
            <h5>
              {s.icon} {s.title}
            </h5>
            {items.length ? (
              <ul>
                {items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            ) : (
              <p className="empty">· 해당 없음</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
