import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { USERS } from '../data/mockData'
import { ROLES, ROLE_LABEL, ROLE_DESC } from '../data/constants'

const ROLE_ICON = {
  [ROLES.EMPLOYEE]: '🧑‍💻',
  [ROLES.TEAMLEAD]: '🧑‍🔧',
  [ROLES.MANAGER]: '🧑‍✈️',
  [ROLES.STRATEGY]: '📊',
  [ROLES.EXECUTIVE]: '👔',
}

const ROLE_ORDER = [ROLES.EMPLOYEE, ROLES.TEAMLEAD, ROLES.MANAGER, ROLES.STRATEGY, ROLES.EXECUTIVE]

export default function Login() {
  const { login } = useApp()
  const [role, setRole] = useState(ROLES.EMPLOYEE)

  const usersOfRole = USERS.filter((u) => u.role === role)

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo">
            <span className="mark">W</span>
            WeeklyFlow
          </div>
          <p>주간보고 작성 → 승인 → 취합 → 임원 보고까지 한 흐름으로 관리하는 사내 업무 자동화 포털</p>
        </div>

        <div className="card card-pad">
          <h3 style={{ marginBottom: 4 }}>1. 역할을 선택하세요</h3>
          <p className="muted" style={{ marginBottom: 16, fontSize: 13 }}>
            실제 인증 없이 역할별 화면과 권한을 체험할 수 있습니다 (Mock Login).
          </p>
          <div className="role-grid">
            {ROLE_ORDER.map((r) => (
              <button
                key={r}
                className={`role-card ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                <div className="role-icon">{ROLE_ICON[r]}</div>
                <h4>{ROLE_LABEL[r]}</h4>
                <p>{ROLE_DESC[r]}</p>
              </button>
            ))}
          </div>

          <div className="user-list">
            <h3 style={{ marginBottom: 4 }}>2. 계정을 선택해 로그인</h3>
            <p className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
              {ROLE_LABEL[role]} 계정 {usersOfRole.length}개
            </p>
            {usersOfRole.map((u) => (
              <div className="user-row" key={u.id}>
                <div className="row">
                  <span className="avatar">{u.name[0]}</span>
                  <div>
                    <strong style={{ fontSize: 14 }}>{u.name}</strong>
                    <div className="muted" style={{ fontSize: 12.5 }}>
                      {[u.department, u.office, u.team].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => login(u)}>
                  로그인 →
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="muted" style={{ textAlign: 'center', marginTop: 18, fontSize: 12.5 }}>
          모든 데이터는 브라우저 localStorage에 저장됩니다. (백엔드 없이 동작하는 프로토타입)
        </p>
      </div>
    </div>
  )
}
