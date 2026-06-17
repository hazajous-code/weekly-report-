import { ROLES, STATUS, FEEDBACK_ACTION } from './constants'

// ─────────────────────────────────────────────────────────────
// 조직: 본부(department) › 실(office) › 팀(team)
// ─────────────────────────────────────────────────────────────
export const DEPARTMENT = '디지털혁신본부'

// 실 → 소속 팀 매핑
export const OFFICES = [
  { name: 'DX기획실', teams: ['포털기획팀', '업무혁신팀'] },
  { name: '데이터플랫폼실', teams: ['데이터엔지니어링팀'] },
  { name: 'AI서비스실', teams: ['AI서비스팀'] },
]
export const OFFICE_NAMES = OFFICES.map((o) => o.name)
export function teamsOfOffice(office) {
  return OFFICES.find((o) => o.name === office)?.teams || []
}

export const USERS = [
  // ── 현업 담당자 ──────────────────────────────────────────
  { id: 'u-emp-1', name: '김도현', role: ROLES.EMPLOYEE, team: '포털기획팀', office: 'DX기획실', department: DEPARTMENT },
  { id: 'u-emp-2', name: '이서연', role: ROLES.EMPLOYEE, team: '포털기획팀', office: 'DX기획실', department: DEPARTMENT },
  { id: 'u-emp-3', name: '조민재', role: ROLES.EMPLOYEE, team: '업무혁신팀', office: 'DX기획실', department: DEPARTMENT },
  { id: 'u-emp-4', name: '박준호', role: ROLES.EMPLOYEE, team: '데이터엔지니어링팀', office: '데이터플랫폼실', department: DEPARTMENT },
  { id: 'u-emp-5', name: '최유진', role: ROLES.EMPLOYEE, team: '데이터엔지니어링팀', office: '데이터플랫폼실', department: DEPARTMENT },
  { id: 'u-emp-6', name: '정민석', role: ROLES.EMPLOYEE, team: 'AI서비스팀', office: 'AI서비스실', department: DEPARTMENT },
  { id: 'u-emp-7', name: '한지원', role: ROLES.EMPLOYEE, team: 'AI서비스팀', office: 'AI서비스실', department: DEPARTMENT },
  // ── 팀장 ────────────────────────────────────────────────
  { id: 'u-lead-1', name: '김선우', role: ROLES.TEAMLEAD, team: '포털기획팀', office: 'DX기획실', department: DEPARTMENT },
  { id: 'u-lead-2', name: '박하늘', role: ROLES.TEAMLEAD, team: '업무혁신팀', office: 'DX기획실', department: DEPARTMENT },
  { id: 'u-lead-3', name: '한도윤', role: ROLES.TEAMLEAD, team: '데이터엔지니어링팀', office: '데이터플랫폼실', department: DEPARTMENT },
  { id: 'u-lead-4', name: '송지아', role: ROLES.TEAMLEAD, team: 'AI서비스팀', office: 'AI서비스실', department: DEPARTMENT },
  // ── 실장 ────────────────────────────────────────────────
  { id: 'u-mgr-1', name: '오세훈', role: ROLES.MANAGER, team: '', office: 'DX기획실', department: DEPARTMENT },
  { id: 'u-mgr-2', name: '강나래', role: ROLES.MANAGER, team: '', office: '데이터플랫폼실', department: DEPARTMENT },
  { id: 'u-mgr-3', name: '윤태경', role: ROLES.MANAGER, team: '', office: 'AI서비스실', department: DEPARTMENT },
  // ── 전략기획팀 / 임원 ───────────────────────────────────
  { id: 'u-strat-1', name: '서지안', role: ROLES.STRATEGY, team: '전략기획팀', office: '전략기획팀', department: '경영전략본부' },
  { id: 'u-exec-1', name: '노상헌', role: ROLES.EXECUTIVE, team: '경영진', office: '경영진', department: '경영진' },
]

export function getUser(id) {
  return USERS.find((u) => u.id === id)
}
export function userName(id) {
  return getUser(id)?.name || '알 수 없음'
}

// ─────────────────────────────────────────────────────────────
// 주간 보고서 (WeeklyReport) — 1차 검토자: 팀장
// ─────────────────────────────────────────────────────────────
const fb = (id, reportId, writerId, writerRole, action, comment, createdAt) => ({
  id,
  reportId,
  writerId,
  writerRole,
  action,
  comment,
  createdAt,
})

export const REPORTS = [
  // ── 현재 주차 (2026-W25) ─────────────────────────────────
  {
    id: 'r-1001',
    week: '2026-W25',
    authorId: 'u-emp-1',
    team: '포털기획팀',
    office: 'DX기획실',
    title: '그룹 통합포털 UX 개편',
    progress:
      '메인 대시보드 정보구조(IA) 재설계 및 와이어프레임 1차 완료, 현업 부서 사용자 인터뷰 8건 진행. 핵심 사용 시나리오 5종 정의.',
    quantitativeValue: '와이어프레임 12종 완성 / 사용자 인터뷰 8건 / 개선 과제 23건 도출',
    qualitativeValue: '현업 부서 피드백 수렴 체계 확립, 디자인 시스템 적용 기준 합의',
    issues: '레거시 SSO 연동 방식이 확정되지 않아 로그인·권한 화면 설계 일부 보류',
    nextPlan: '와이어프레임 2차 확정, 클릭형 프로토타입 제작 착수, 사용성 테스트 대상자 모집',
    supportNeeded: '정보보안팀의 SSO 연동 가이드 회신 (6/20까지)',
    status: STATUS.APPROVED,
    createdAt: '2026-06-15T09:20:00+09:00',
    updatedAt: '2026-06-16T15:10:00+09:00',
    feedbackHistory: [
      fb('f-1', 'r-1001', 'u-emp-1', ROLES.EMPLOYEE, FEEDBACK_ACTION.SUBMIT, '1차 제출합니다.', '2026-06-15T18:02:00+09:00'),
      fb('f-2', 'r-1001', 'u-lead-1', ROLES.TEAMLEAD, FEEDBACK_ACTION.APPROVE, '정보구조 개선 방향이 명확합니다. SSO 이슈는 보안팀과 별도 미팅을 잡아 진행해 주세요. 승인합니다.', '2026-06-16T15:10:00+09:00'),
    ],
  },
  {
    id: 'r-1002',
    week: '2026-W25',
    authorId: 'u-emp-2',
    team: '포털기획팀',
    office: 'DX기획실',
    title: '사내 전자결재 고도화',
    progress: '결재선 자동 추천 로직 요건 정의, 전사 결재 양식 30종 분석 및 자동화 대상 선별.',
    quantitativeValue: '결재 양식 30종 분석 / 자동화 대상 12종 선정',
    qualitativeValue: '반복 결재 패턴 데이터 확보, 부서별 결재 규정 차이 파악',
    issues: '일부 부서의 결재 규정이 상이하여 표준화에 난항',
    nextPlan: '자동 추천 알고리즘 PoC 진행',
    supportNeeded: '인사팀 직제·조직 데이터 제공',
    status: STATUS.REJECTED,
    createdAt: '2026-06-15T10:05:00+09:00',
    updatedAt: '2026-06-16T16:40:00+09:00',
    feedbackHistory: [
      fb('f-3', 'r-1002', 'u-emp-2', ROLES.EMPLOYEE, FEEDBACK_ACTION.SUBMIT, '제출합니다.', '2026-06-15T18:30:00+09:00'),
      fb('f-4', 'r-1002', 'u-lead-1', ROLES.TEAMLEAD, FEEDBACK_ACTION.REJECT, '결재 양식 분석은 좋습니다. 다만 정량 성과에 "예상 절감 시간/건수"를 수치로 추가해 주세요. 이슈의 부서 표준화 건은 대응 방안까지 함께 기재 바랍니다. 보완 후 재제출 부탁드립니다.', '2026-06-16T16:40:00+09:00'),
    ],
  },
  {
    id: 'r-1003',
    week: '2026-W25',
    authorId: 'u-emp-3',
    team: '업무혁신팀',
    office: 'DX기획실',
    title: 'RPA 기반 반복 업무 자동화',
    progress: '회계·총무 반복 업무 12종 프로세스 분석, RPA 봇 3종 시범 적용.',
    quantitativeValue: '자동화 대상 12종 도출 / 봇 3종 적용 / 월 120시간 절감 예상',
    qualitativeValue: '현업 부서 자동화 수용도 향상',
    issues: '일부 레거시 화면은 UI 변경이 잦아 봇 유지보수 부담',
    nextPlan: '봇 5종 추가 개발, 예외 처리 고도화',
    supportNeeded: 'IT운영팀 RPA 실행 계정 권한',
    status: STATUS.SUBMITTED,
    createdAt: '2026-06-15T11:00:00+09:00',
    updatedAt: '2026-06-15T17:45:00+09:00',
    feedbackHistory: [
      fb('f-5', 'r-1003', 'u-emp-3', ROLES.EMPLOYEE, FEEDBACK_ACTION.SUBMIT, '제출합니다. 검토 부탁드립니다.', '2026-06-15T17:45:00+09:00'),
    ],
  },
  {
    id: 'r-1004',
    week: '2026-W25',
    authorId: 'u-emp-4',
    team: '데이터엔지니어링팀',
    office: '데이터플랫폼실',
    title: '전사 데이터 레이크 구축',
    progress: '원천 시스템 5종 데이터 적재 파이프라인 구축, 데이터 품질 룰 40건 정의 및 적용.',
    quantitativeValue: '파이프라인 5종 구축 / 적재 데이터 1.2TB / 품질 룰 40건',
    qualitativeValue: '데이터 거버넌스 체계 초안 마련, 메타데이터 관리 기준 합의',
    issues: '일부 원천 시스템 API rate limit으로 야간 배치 지연 발생',
    nextPlan: '추가 3종 시스템 연동, 데이터 카탈로그 PoC 착수',
    supportNeeded: '인프라팀 배치 서버 증설 검토',
    status: STATUS.APPROVED,
    createdAt: '2026-06-15T11:00:00+09:00',
    updatedAt: '2026-06-16T13:20:00+09:00',
    feedbackHistory: [
      fb('f-6', 'r-1004', 'u-emp-4', ROLES.EMPLOYEE, FEEDBACK_ACTION.SUBMIT, '제출합니다.', '2026-06-15T17:30:00+09:00'),
      fb('f-7', 'r-1004', 'u-lead-3', ROLES.TEAMLEAD, FEEDBACK_ACTION.APPROVE, '파이프라인 구축 성과 명확합니다. 배치 지연 건은 인프라팀과 협의 진행하세요. 승인합니다.', '2026-06-16T13:20:00+09:00'),
    ],
  },
  {
    id: 'r-1005',
    week: '2026-W25',
    authorId: 'u-emp-5',
    team: '데이터엔지니어링팀',
    office: '데이터플랫폼실',
    title: '실시간 모니터링 대시보드',
    progress: '핵심 운영 지표 정의 진행 중 (작성 중).',
    quantitativeValue: '',
    qualitativeValue: '',
    issues: '',
    nextPlan: '',
    supportNeeded: '',
    status: STATUS.DRAFT,
    createdAt: '2026-06-16T09:30:00+09:00',
    updatedAt: '2026-06-16T09:30:00+09:00',
    feedbackHistory: [],
  },
  {
    id: 'r-1006',
    week: '2026-W25',
    authorId: 'u-emp-6',
    team: 'AI서비스팀',
    office: 'AI서비스실',
    title: 'AI 고객상담 봇 고도화',
    progress: '상담 인텐트 분류 모델 재학습 및 응답 정확도 개선, 오답 패턴 분석 체계화.',
    quantitativeValue: '인텐트 분류 정확도 87% → 93% / 학습 데이터 1.5만 건 추가',
    qualitativeValue: '상담사 만족도 조사 긍정 응답 증가, 오답 유형 라벨링 프로세스 정립',
    issues: '일부 도메인 데이터 부족으로 롱테일 인텐트 정확도가 낮음',
    nextPlan: '롱테일 인텐트 데이터 증강, 운영 전환 전 A/B 테스트 설계',
    supportNeeded: '상담 로그 추가 확보 권한 (개인정보 비식별 처리 포함)',
    status: STATUS.APPROVED,
    createdAt: '2026-06-15T09:50:00+09:00',
    updatedAt: '2026-06-16T14:20:00+09:00',
    feedbackHistory: [
      fb('f-8', 'r-1006', 'u-emp-6', ROLES.EMPLOYEE, FEEDBACK_ACTION.SUBMIT, '제출합니다.', '2026-06-15T18:10:00+09:00'),
      fb('f-9', 'r-1006', 'u-lead-4', ROLES.TEAMLEAD, FEEDBACK_ACTION.APPROVE, '정확도 개선 성과가 명확합니다. A/B 테스트 결과는 다음 주 공유 바랍니다. 승인합니다.', '2026-06-16T14:20:00+09:00'),
    ],
  },
  {
    id: 'r-1007',
    week: '2026-W25',
    authorId: 'u-emp-7',
    team: 'AI서비스팀',
    office: 'AI서비스실',
    title: '사내 문서 검색 RAG 시스템',
    progress: '사내 문서 1.2만 건 임베딩 및 검색 파이프라인 구축, 권한 기반 검색 설계.',
    quantitativeValue: '문서 1.2만 건 인덱싱 / 검색 정확도(Top-3) 82%',
    qualitativeValue: '부서별 권한 기반 검색 모델 설계, 검색 품질 평가 기준 수립',
    issues: '권한 필터링 적용 시 검색 응답 성능 저하',
    nextPlan: '벡터 인덱스 최적화, 파일럿 부서 오픈',
    supportNeeded: '파일럿 부서 선정 및 협조 요청',
    status: STATUS.SUBMITTED,
    createdAt: '2026-06-15T13:15:00+09:00',
    updatedAt: '2026-06-15T18:25:00+09:00',
    feedbackHistory: [
      fb('f-10', 'r-1007', 'u-emp-7', ROLES.EMPLOYEE, FEEDBACK_ACTION.SUBMIT, '제출합니다.', '2026-06-15T18:25:00+09:00'),
    ],
  },

  // ── 지난 주차 (2026-W24) — 이력/분석용 ───────────────────
  {
    id: 'r-0901',
    week: '2026-W24',
    authorId: 'u-emp-1',
    team: '포털기획팀',
    office: 'DX기획실',
    title: '그룹 통합포털 UX 개편 (착수)',
    progress: '프로젝트 킥오프 및 현황 조사, 벤치마킹 5개사 분석.',
    quantitativeValue: '벤치마킹 5건 / 요구사항 인터뷰 4건',
    qualitativeValue: '프로젝트 범위 및 추진 체계 합의',
    issues: '특이사항 없음',
    nextPlan: 'IA 재설계 및 와이어프레임 착수',
    supportNeeded: '없음',
    status: STATUS.APPROVED,
    createdAt: '2026-06-08T09:00:00+09:00',
    updatedAt: '2026-06-09T15:00:00+09:00',
    feedbackHistory: [
      fb('f-21', 'r-0901', 'u-lead-1', ROLES.TEAMLEAD, FEEDBACK_ACTION.APPROVE, '착수 보고 승인합니다.', '2026-06-09T15:00:00+09:00'),
    ],
  },
  {
    id: 'r-0904',
    week: '2026-W24',
    authorId: 'u-emp-4',
    team: '데이터엔지니어링팀',
    office: '데이터플랫폼실',
    title: '전사 데이터 레이크 구축 (설계)',
    progress: '아키텍처 설계 및 원천 시스템 인벤토리 작성.',
    quantitativeValue: '원천 시스템 12종 인벤토리 / 아키텍처 설계서 1종',
    qualitativeValue: '데이터 적재 우선순위 기준 합의',
    issues: '없음',
    nextPlan: '파이프라인 구축 착수',
    supportNeeded: '없음',
    status: STATUS.APPROVED,
    createdAt: '2026-06-08T10:00:00+09:00',
    updatedAt: '2026-06-09T16:00:00+09:00',
    feedbackHistory: [
      fb('f-22', 'r-0904', 'u-lead-3', ROLES.TEAMLEAD, FEEDBACK_ACTION.APPROVE, '설계 방향 좋습니다. 승인.', '2026-06-09T16:00:00+09:00'),
    ],
  },
  {
    id: 'r-0906',
    week: '2026-W24',
    authorId: 'u-emp-6',
    team: 'AI서비스팀',
    office: 'AI서비스실',
    title: 'AI 고객상담 봇 고도화 (현황 분석)',
    progress: '기존 봇 응답 로그 분석 및 오답 유형 분류.',
    quantitativeValue: '응답 로그 5만 건 분석 / 오답 유형 18종 분류',
    qualitativeValue: '개선 우선순위 도출',
    issues: '없음',
    nextPlan: '인텐트 분류 모델 재학습',
    supportNeeded: '없음',
    status: STATUS.APPROVED,
    createdAt: '2026-06-08T11:00:00+09:00',
    updatedAt: '2026-06-09T17:00:00+09:00',
    feedbackHistory: [
      fb('f-23', 'r-0906', 'u-lead-4', ROLES.TEAMLEAD, FEEDBACK_ACTION.APPROVE, '승인합니다.', '2026-06-09T17:00:00+09:00'),
    ],
  },
]

// ─────────────────────────────────────────────────────────────
// 팀 요약 (TeamSummary) — 팀장이 작성, 실장이 검토
// ─────────────────────────────────────────────────────────────
export const TEAM_SUMMARIES = [
  {
    id: 'ts-2501',
    week: '2026-W25',
    team: '포털기획팀',
    office: 'DX기획실',
    leadId: 'u-lead-1',
    reportIds: ['r-1001'],
    headline: '포털기획팀 — 통합포털 UX 개편 1차 설계 완료',
    keyAchievements: '와이어프레임 12종 / 사용자 인터뷰 8건 / 개선 과제 23건 도출',
    issues: 'SSO 연동 방식 미확정으로 권한 화면 설계 일부 보류',
    status: STATUS.SUBMITTED,
    createdAt: '2026-06-16T17:00:00+09:00',
    updatedAt: '2026-06-16T17:00:00+09:00',
    feedbackHistory: [
      fb('tf-1', 'ts-2501', 'u-lead-1', ROLES.TEAMLEAD, FEEDBACK_ACTION.SUBMIT, '포털기획팀 주간 요약 제출합니다.', '2026-06-16T17:00:00+09:00'),
    ],
  },
  {
    id: 'ts-2502',
    week: '2026-W25',
    team: '데이터엔지니어링팀',
    office: '데이터플랫폼실',
    leadId: 'u-lead-3',
    reportIds: ['r-1004'],
    headline: '데이터엔지니어링팀 — 데이터 레이크 파이프라인 구축',
    keyAchievements: '파이프라인 5종 / 적재 1.2TB / 품질 룰 40건',
    issues: '원천 시스템 API rate limit으로 야간 배치 지연',
    status: STATUS.SUBMITTED,
    createdAt: '2026-06-16T17:10:00+09:00',
    updatedAt: '2026-06-16T17:10:00+09:00',
    feedbackHistory: [
      fb('tf-2', 'ts-2502', 'u-lead-3', ROLES.TEAMLEAD, FEEDBACK_ACTION.SUBMIT, '제출합니다.', '2026-06-16T17:10:00+09:00'),
    ],
  },
  {
    id: 'ts-2503',
    week: '2026-W25',
    team: 'AI서비스팀',
    office: 'AI서비스실',
    leadId: 'u-lead-4',
    reportIds: ['r-1006'],
    headline: 'AI서비스팀 — 상담봇 정확도 93% 달성',
    keyAchievements: '인텐트 정확도 87%→93% / 학습 데이터 1.5만 건 추가',
    issues: '롱테일 인텐트 데이터 부족',
    status: STATUS.SUBMITTED,
    createdAt: '2026-06-16T17:20:00+09:00',
    updatedAt: '2026-06-16T17:20:00+09:00',
    feedbackHistory: [
      fb('tf-3', 'ts-2503', 'u-lead-4', ROLES.TEAMLEAD, FEEDBACK_ACTION.SUBMIT, '제출합니다.', '2026-06-16T17:20:00+09:00'),
    ],
  },
]

// ─────────────────────────────────────────────────────────────
// 실 요약 (OfficeSummary) — 실장이 작성, 전략기획팀이 취합
// ─────────────────────────────────────────────────────────────
export const OFFICE_SUMMARIES = [
  {
    id: 'os-2501',
    week: '2026-W25',
    office: 'DX기획실',
    managerId: 'u-mgr-1',
    teamSummaryIds: ['ts-2501'],
    headline: 'DX기획실 — 통합포털·전자결재 디지털 전환 추진',
    keyAchievements: '통합포털 UX 개편 1차 설계 완료, 전자결재 자동화 대상 12종 선정',
    issues: 'SSO 연동 방식 확정 필요 (정보보안팀 협의)',
    decisionsNeeded: '통합포털 프로토타입 단계 예산 집행 승인',
    status: STATUS.SUBMITTED,
    createdAt: '2026-06-16T18:30:00+09:00',
    updatedAt: '2026-06-16T18:30:00+09:00',
  },
]

// ─────────────────────────────────────────────────────────────
// 임원 보고용 요약 (ExecutiveSummary) — 전략기획팀이 생성
// ─────────────────────────────────────────────────────────────
export const EXEC_SUMMARIES = [
  {
    id: 'es-2401',
    week: '2026-W24',
    authorId: 'u-strat-1',
    keyAchievements:
      '· 통합포털 개편 프로젝트 착수 (DX기획실)\n· 전사 데이터 레이크 아키텍처 설계 완료 (데이터플랫폼실)\n· AI 상담봇 현황 분석 및 개선 과제 도출 (AI서비스실)',
    majorIssues: '· 특이 리스크 없음 — 전 부서 정상 추진 중',
    risks: '· 데이터 레이크 인프라 비용 사전 검토 필요',
    decisionsNeeded: '· 통합포털 개편 예산 1차 승인 요청',
    status: STATUS.EXEC_SUBMITTED,
    createdAt: '2026-06-10T09:00:00+09:00',
    updatedAt: '2026-06-10T11:00:00+09:00',
    execComments: [
      {
        id: 'ec-1',
        writerId: 'u-exec-1',
        comment: '전반적으로 순항 중입니다. 데이터 레이크 인프라 비용은 재무팀과 협의 후 다음 주 보고 바랍니다.',
        createdAt: '2026-06-10T11:00:00+09:00',
      },
    ],
  },
]
