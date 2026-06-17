import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { REPORTS, TEAM_SUMMARIES, OFFICE_SUMMARIES, EXEC_SUMMARIES } from '../data/mockData'
import { STATUS, FEEDBACK_ACTION, CURRENT_WEEK } from '../data/constants'
import { load, save, clearAll, genId } from '../utils/storage'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const now = () => new Date().toISOString()

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => load('currentUser', null))
  const [reports, setReports] = useState(() => load('reports', REPORTS))
  const [teamSummaries, setTeamSummaries] = useState(() => load('teamSummaries', TEAM_SUMMARIES))
  const [officeSummaries, setOfficeSummaries] = useState(() => load('officeSummaries', OFFICE_SUMMARIES))
  const [execSummaries, setExecSummaries] = useState(() => load('execSummaries', EXEC_SUMMARIES))

  const [view, setView] = useState('login')
  const [params, setParams] = useState({})
  const [week, setWeek] = useState(CURRENT_WEEK)
  const [toast, setToast] = useState('')

  // 영속화
  useEffect(() => save('currentUser', currentUser), [currentUser])
  useEffect(() => save('reports', reports), [reports])
  useEffect(() => save('teamSummaries', teamSummaries), [teamSummaries])
  useEffect(() => save('officeSummaries', officeSummaries), [officeSummaries])
  useEffect(() => save('execSummaries', execSummaries), [execSummaries])

  const navigate = (v, p = {}) => {
    setView(v)
    setParams(p)
  }

  // ── 인증(Mock) ────────────────────────────────────────────
  const login = (user) => {
    setCurrentUser(user)
    navigate(defaultViewForRole(user.role))
  }
  const logout = () => {
    setCurrentUser(null)
    navigate('login')
  }

  // ── 보고서 ────────────────────────────────────────────────
  const upsertReport = (data) => {
    setReports((prev) => {
      const exists = prev.some((r) => r.id === data.id)
      if (exists) return prev.map((r) => (r.id === data.id ? { ...r, ...data, updatedAt: now() } : r))
      return [{ ...data, createdAt: now(), updatedAt: now() }, ...prev]
    })
  }

  const saveDraft = (form) => {
    const id = form.id || genId('r')
    upsertReport({ ...form, id, status: STATUS.DRAFT })
    return id
  }

  const submitReport = (form) => {
    const id = form.id || genId('r')
    const entry = {
      id: genId('f'),
      reportId: id,
      writerId: currentUser.id,
      writerRole: currentUser.role,
      action: FEEDBACK_ACTION.SUBMIT,
      comment: form.id ? '보완 후 재제출합니다.' : '제출합니다.',
      createdAt: now(),
    }
    setReports((prev) => {
      const exists = prev.some((r) => r.id === id)
      const base = { ...form, id, status: STATUS.SUBMITTED, updatedAt: now() }
      if (exists) {
        return prev.map((r) =>
          r.id === id ? { ...r, ...base, feedbackHistory: [...(r.feedbackHistory || []), entry] } : r,
        )
      }
      return [{ ...base, createdAt: now(), feedbackHistory: [entry] }, ...prev]
    })
    return id
  }

  // 팀장 1차 검토: 승인 / 반려 / 코멘트
  const reviewReport = (reportId, action, comment) => {
    const statusByAction = {
      [FEEDBACK_ACTION.APPROVE]: STATUS.APPROVED,
      [FEEDBACK_ACTION.REJECT]: STATUS.REJECTED,
    }
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r
        const entry = {
          id: genId('f'),
          reportId,
          writerId: currentUser.id,
          writerRole: currentUser.role,
          action,
          comment,
          createdAt: now(),
        }
        return {
          ...r,
          status: statusByAction[action] || r.status,
          updatedAt: now(),
          feedbackHistory: [...(r.feedbackHistory || []), entry],
        }
      }),
    )
  }

  // ── 팀 요약 (팀장 작성 / 실장 검토) ───────────────────────
  const saveTeamSummary = (data, { submit } = {}) => {
    const id = data.id || genId('ts')
    setTeamSummaries((prev) => {
      const exists = prev.some((t) => t.id === id)
      const status = submit ? STATUS.SUBMITTED : data.status || STATUS.DRAFT
      const entry = submit
        ? {
            id: genId('tf'),
            reportId: id,
            writerId: currentUser.id,
            writerRole: currentUser.role,
            action: FEEDBACK_ACTION.SUBMIT,
            comment: '팀 요약 제출합니다.',
            createdAt: now(),
          }
        : null
      if (exists) {
        return prev.map((t) =>
          t.id === id
            ? { ...t, ...data, status, updatedAt: now(), feedbackHistory: [...(t.feedbackHistory || []), ...(entry ? [entry] : [])] }
            : t,
        )
      }
      return [{ ...data, id, status, createdAt: now(), updatedAt: now(), feedbackHistory: entry ? [entry] : [] }, ...prev]
    })
    return id
  }

  // 실장이 팀 요약 검토 (승인/반려/코멘트)
  const reviewTeamSummary = (summaryId, action, comment) => {
    const statusByAction = {
      [FEEDBACK_ACTION.APPROVE]: STATUS.APPROVED,
      [FEEDBACK_ACTION.REJECT]: STATUS.REJECTED,
    }
    setTeamSummaries((prev) =>
      prev.map((t) => {
        if (t.id !== summaryId) return t
        const entry = {
          id: genId('tf'),
          reportId: summaryId,
          writerId: currentUser.id,
          writerRole: currentUser.role,
          action,
          comment,
          createdAt: now(),
        }
        return {
          ...t,
          status: statusByAction[action] || t.status,
          updatedAt: now(),
          feedbackHistory: [...(t.feedbackHistory || []), entry],
        }
      }),
    )
  }

  // ── 실 요약 (실장 작성 / 전략기획 취합) ───────────────────
  const saveOfficeSummary = (data) => {
    const id = data.id || genId('os')
    setOfficeSummaries((prev) => {
      const exists = prev.some((o) => o.id === id)
      if (exists) return prev.map((o) => (o.id === id ? { ...o, ...data, updatedAt: now() } : o))
      return [{ ...data, id, createdAt: now(), updatedAt: now() }, ...prev]
    })
    return id
  }

  // ── 임원 보고 요약 ─────────────────────────────────────────
  const saveExecSummary = (data) => {
    const id = data.id || genId('es')
    setExecSummaries((prev) => {
      const exists = prev.some((e) => e.id === id)
      if (exists) return prev.map((e) => (e.id === id ? { ...e, ...data, updatedAt: now() } : e))
      return [{ ...data, id, createdAt: now(), updatedAt: now(), execComments: data.execComments || [] }, ...prev]
    })
    return id
  }

  const addExecComment = (execSummaryId, comment) => {
    setExecSummaries((prev) =>
      prev.map((e) =>
        e.id === execSummaryId
          ? {
              ...e,
              execComments: [...(e.execComments || []), { id: genId('ec'), writerId: currentUser.id, comment, createdAt: now() }],
              updatedAt: now(),
            }
          : e,
      ),
    )
  }

  const resetData = () => {
    clearAll()
    setReports(REPORTS)
    setTeamSummaries(TEAM_SUMMARIES)
    setOfficeSummaries(OFFICE_SUMMARIES)
    setExecSummaries(EXEC_SUMMARIES)
    setCurrentUser(null)
    navigate('login')
  }

  const value = useMemo(
    () => ({
      currentUser,
      reports,
      teamSummaries,
      officeSummaries,
      execSummaries,
      view,
      params,
      week,
      setWeek,
      toast,
      setToast,
      navigate,
      login,
      logout,
      saveDraft,
      submitReport,
      reviewReport,
      saveTeamSummary,
      reviewTeamSummary,
      saveOfficeSummary,
      saveExecSummary,
      addExecComment,
      resetData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, reports, teamSummaries, officeSummaries, execSummaries, view, params, week, toast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function defaultViewForRole(role) {
  return {
    employee: 'employee-home',
    teamlead: 'teamlead-home',
    manager: 'manager-home',
    strategy: 'strategy-home',
    executive: 'executive-home',
  }[role]
}
