import { useApp } from '../context/AppContext'
import { ROLES, ROLE_LABEL, STATUS, WEEKS } from '../data/constants'

// 역할별 사이드바 메뉴
const NAV = {
  [ROLES.EMPLOYEE]: [
    { view: 'employee-home', label: '내 대시보드', icon: '🏠' },
    { view: 'report-editor', label: '주간보고 작성', icon: '✍️' },
    { view: 'feedback-history', label: '피드백 · 이력', icon: '💬' },
  ],
  [ROLES.TEAMLEAD]: [
    { view: 'teamlead-home', label: '팀 검토 대시보드', icon: '📋' },
    { view: 'team-summary', label: '팀 요약 작성', icon: '🧩' },
    { view: 'feedback-history', label: '피드백 · 이력', icon: '💬' },
  ],
  [ROLES.MANAGER]: [
    { view: 'manager-home', label: '실 검토 대시보드', icon: '🗂️' },
    { view: 'office-summary', label: '실 요약 작성', icon: '🏢' },
    { view: 'feedback-history', label: '피드백 · 이력', icon: '💬' },
  ],
  [ROLES.STRATEGY]: [
    { view: 'strategy-home', label: '전략기획 취합', icon: '📊' },
    { view: 'exec-summary-builder', label: '임원 보고 요약 생성', icon: '🤖' },
    { view: 'feedback-history', label: '피드백 · 이력', icon: '💬' },
  ],
  [ROLES.EXECUTIVE]: [
    { view: 'executive-home', label: '임원 검토', icon: '👔' },
    { view: 'feedback-history', label: '피드백 · 이력', icon: '💬' },
  ],
}

const CRUMB = {
  'employee-home': '현업 담당자 대시보드',
  'report-editor': '주간보고 작성',
  'teamlead-home': '팀장 검토 대시보드',
  'manager-home': '실장 검토 대시보드',
  'report-detail': '보고서 상세',
  'team-summary': '팀 요약 작성',
  'office-summary': '실 요약 작성',
  'team-summary-detail': '팀 요약 검토',
  'strategy-home': '전략기획팀 취합 대시보드',
  'exec-summary-builder': '임원 보고용 요약 생성',
  'executive-home': '임원 검토',
  'feedback-history': '피드백 · 이력',
}

export default function Layout({ children }) {
  const { currentUser, view, navigate, logout, reports, teamSummaries, week, setWeek, resetData } = useApp()
  const items = NAV[currentUser.role] || []

  // 팀장: 본인 팀의 검토 대기(제출) 보고 수
  const pendingForLead =
    currentUser.role === ROLES.TEAMLEAD
      ? reports.filter((r) => r.team === currentUser.team && r.week === week && r.status === STATUS.SUBMITTED).length
      : 0
  // 실장: 본인 실의 검토 대기 팀 요약 수
  const pendingForManager =
    currentUser.role === ROLES.MANAGER
      ? teamSummaries.filter((t) => t.office === currentUser.office && t.week === week && t.status === STATUS.SUBMITTED).length
      : 0

  const badgeFor = (v) => {
    if (v === 'teamlead-home') return pendingForLead
    if (v === 'manager-home') return pendingForManager
    return 0
  }

  const scopeLabel = [currentUser.office, currentUser.team].filter(Boolean).join(' · ')

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="mark">✲</span>
          WeeklyFlow
        </div>
        <div className="nav-section">메뉴</div>
        {items.map((it) => {
          const badge = badgeFor(it.view)
          return (
            <button
              key={it.view}
              className={`nav-item ${view === it.view ? 'active' : ''}`}
              onClick={() => navigate(it.view)}
            >
              <span className="nav-icon">{it.icon}</span>
              {it.label}
              {badge > 0 && <span className="nav-badge">{badge}</span>}
            </button>
          )
        })}

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <span className="avatar">{currentUser.name[0]}</span>
            <div className="meta">
              <strong>{currentUser.name}</strong>
              <span>{ROLE_LABEL[currentUser.role]}{scopeLabel ? ` · ${scopeLabel}` : ''}</span>
            </div>
          </div>
          <button className="nav-item" onClick={resetData} title="샘플 데이터 초기화">
            <span className="nav-icon">♻️</span>데이터 초기화
          </button>
          <button className="nav-item" onClick={logout}>
            <span className="nav-icon">⎋</span>로그아웃
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="crumb">
            {CRUMB[view] || 'WeeklyFlow'}
            <small>{currentUser.department} · {ROLE_LABEL[currentUser.role]}</small>
          </div>
          <div className="topbar-right">
            <label className="muted" style={{ fontSize: 12.5 }}>보고 주차</label>
            <select className="week-select" value={week} onChange={(e) => setWeek(e.target.value)}>
              {WEEKS.map((w) => (
                <option key={w.key} value={w.key}>{w.label} ({w.range})</option>
              ))}
            </select>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  )
}
