// 역할 정의
export const ROLES = {
  EMPLOYEE: 'employee', // 현업 담당자
  TEAMLEAD: 'teamlead', // 팀장 (1차 검토 + 팀 요약)
  MANAGER: 'manager', // 실장 (팀 요약 검토 + 실 요약)
  STRATEGY: 'strategy', // 전략기획팀
  EXECUTIVE: 'executive', // 임원
}

export const ROLE_LABEL = {
  [ROLES.EMPLOYEE]: '현업 담당자',
  [ROLES.TEAMLEAD]: '팀장',
  [ROLES.MANAGER]: '실장',
  [ROLES.STRATEGY]: '전략기획팀',
  [ROLES.EXECUTIVE]: '임원',
}

export const ROLE_DESC = {
  [ROLES.EMPLOYEE]: '주간 업무를 작성하고 제출합니다.',
  [ROLES.TEAMLEAD]: '팀원 보고를 1차 검토·승인하고 팀 요약을 만듭니다.',
  [ROLES.MANAGER]: '팀 요약을 검토하고 실(室) 요약을 만듭니다.',
  [ROLES.STRATEGY]: '실별 요약을 취합해 임원 보고용 요약을 생성합니다.',
  [ROLES.EXECUTIVE]: '최종 보고를 확인하고 의사결정 코멘트를 남깁니다.',
}

// 보고서 / 요약 상태 흐름
export const STATUS = {
  DRAFT: 'Draft', // 작성 중
  SUBMITTED: 'Submitted', // 제출 완료
  REVIEWED: 'Reviewed', // 검토 완료
  REJECTED: 'Rejected', // 반려
  APPROVED: 'Approved', // 승인
  EXEC_SUBMITTED: 'ExecutiveSubmitted', // 임원 보고 제출 완료
}

export const STATUS_META = {
  [STATUS.DRAFT]: { label: '작성 중', tone: 'gray' },
  [STATUS.SUBMITTED]: { label: '제출 완료', tone: 'blue' },
  [STATUS.REVIEWED]: { label: '검토 완료', tone: 'indigo' },
  [STATUS.REJECTED]: { label: '반려', tone: 'red' },
  [STATUS.APPROVED]: { label: '승인', tone: 'green' },
  [STATUS.EXEC_SUBMITTED]: { label: '임원 보고 완료', tone: 'purple' },
}

// 피드백 액션
export const FEEDBACK_ACTION = {
  SUBMIT: 'submit',
  APPROVE: 'approve',
  REJECT: 'reject',
  COMMENT: 'comment',
}

export const ACTION_LABEL = {
  [FEEDBACK_ACTION.SUBMIT]: '제출',
  [FEEDBACK_ACTION.APPROVE]: '승인',
  [FEEDBACK_ACTION.REJECT]: '반려',
  [FEEDBACK_ACTION.COMMENT]: '코멘트',
}

// 보고 주차
export const WEEKS = [
  { key: '2026-W24', label: '2026년 6월 2주차', range: '06.08 ~ 06.12' },
  { key: '2026-W25', label: '2026년 6월 3주차', range: '06.15 ~ 06.19' },
]
export const CURRENT_WEEK = '2026-W25'

// 제출 마감 (데모용) — 현재 주차 마감일
export const SUBMIT_DEADLINE = '2026-06-17T18:00:00+09:00'

export function weekLabel(key) {
  return WEEKS.find((w) => w.key === key)?.label || key
}
