# WeeklyFlow · 주간보고 자동화 시스템 (MVP)

> 주간보고 **작성 → 팀장 검토 → 실장 검토 → 전략기획 취합 → 임원 보고**까지 하나의 흐름으로 관리하는 사내 업무 자동화 포털.
> 메일·엑셀·문서 기반으로 반복되던 주간보고 취합 업무를 줄이고, 보고 내용의 누락·중복·수정 이력을 체계적으로 관리합니다.

React + Vite 기반 **프론트엔드 전용 프로토타입**입니다. 백엔드 없이 **Mock Data + localStorage**로 동작하며, **Claude 스타일**(웜 페이퍼 배경 · 클레이 액센트 · 세리프 헤딩)로 디자인했습니다. GitHub Pages에 바로 배포할 수 있습니다.

> 📐 **아키텍처 설계도**(현재 MVP + 전사 To-Be): [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
> 🎙️ **기능 설명·시연 스크립트**: [docs/FEATURE_SCRIPT.md](docs/FEATURE_SCRIPT.md)

---

## 1. 서비스 개요

| 항목 | 내용 |
| --- | --- |
| 목적 | 주간보고 작성–검토–취합–임원 보고 전 과정의 디지털 전환(AX) |
| 핵심 가치 | 보고 취합 시간 절감 · 커뮤니케이션 누락 방지 · 피드백 이력 관리 · 임원 보고 자동화 |
| 결재 체계 | 현업 → **팀장** → **실장** → 전략기획팀 → 임원 (5단계) |
| 조직 | 본부(department) › 실(office) › 팀(team) 3계층 |
| 기술 | React 18, Vite 5 (백엔드 없음, localStorage 영속화) |
| AI | Mock AI 요약 (규칙 기반 취합으로 4개 섹션 자동 생성, 실제 API 미연동) |

---

## 2. 사용자 역할별 플로우

```
현업 담당자        팀장             실장              전략기획팀         임원
  │ 작성/제출       │ 1차 검토         │ 2차 검토          │ 취합             │ 확인
  ▼                ▼                ▼                 ▼                ▼
[주간보고]──제출──▶[승인/반려]      [팀요약 승인/반려]   [실요약 취합]      [임원 요약]──▶[코멘트]
  ▲                │ 승인 →[팀 요약]──제출──▶│ 승인 →[실 요약]──제출──▶│ AI 요약 생성──제출──▶│
  └──반려 시 보완·재제출─┘
```

1. **현업 담당자** — 주간보고 작성(진행 내용/정량·정성 성과/이슈/다음 계획/지원 요청) → 임시저장 또는 제출. 반려 시 팀장 피드백 반영 후 재제출.
2. **팀장** — 팀원 보고서 **1차 검토(승인/반려/피드백)** → 승인 보고를 묶어 **팀 요약** 작성 → 실장에게 제출.
3. **실장** — 팀장이 올린 **팀 요약들을 검토(승인/반려)** → 승인된 팀 요약을 묶어 **실(室) 요약** 작성 → 전략기획팀에 제출.
4. **전략기획팀** — 실별 요약 취합 + 자동 분류(성과/이슈/의사결정) → **AI로 임원 보고 초안 생성** → 검토·수정 후 최종 제출.
5. **임원** — 최종 요약본 확인(핵심 성과/이슈/리스크/의사결정 필요) → **코멘트** 등록.

---

## 3. 화면 구성

| 역할 | 화면(view) | 설명 |
| --- | --- | --- |
| 공통 | 로그인 / 역할 선택 (`login`) | Mock Login. 역할 → 계정 선택 |
| 현업 | 대시보드 (`employee-home`) | 내 보고 현황·통계·마감 알림 |
| 현업 | 주간보고 작성 (`report-editor`) | 보고 입력 + AI 요약 미리보기, 임시저장/제출 |
| 팀장 | 팀 검토 대시보드 (`teamlead-home`) | 팀원별 제출 현황, 제출률, 검토 대기 배지 |
| 팀장 | 보고서 상세·승인/반려 (`report-detail`) | 1차 검토 + AI 요약 + 피드백 이력 |
| 팀장 | 팀 요약 작성 (`team-summary`) | 승인 보고 일괄 AI 요약 → 실장에 제출 |
| 실장 | 실 검토 대시보드 (`manager-home`) | 팀별 요약 제출 현황 |
| 실장 | 팀 요약 검토 (`team-summary-detail`) | 팀 요약 승인/반려 |
| 실장 | 실 요약 작성 (`office-summary`) | 승인 팀 요약 취합 → 전략기획에 제출 |
| 전략 | 취합 대시보드 (`strategy-home`) | 전사 제출률, 실별 현황, 지연 제출자, 자동 분류 |
| 전략 | 임원 보고 요약 생성 (`exec-summary-builder`) | AI 초안 생성 → 편집 → 제출 |
| 임원 | 임원 검토 (`executive-home`) | 최종 요약 + 실별 성과 + 코멘트 |
| 공통 | 피드백 · 이력 (`feedback-history`) | 보고서별 피드백 타임라인(누가/언제/무엇) |

### 상태 흐름
`Draft(작성 중)` → `Submitted(제출)` → `Approved(승인)` / `Rejected(반려)` · 임원 요약본은 `ExecutiveSubmitted`
보고서·팀 요약 모두 반려 시 보완 후 재제출하면 다시 `Submitted`가 됩니다.

> 화면 전환은 GitHub Pages 새로고침 404 문제를 피하기 위해 라우터 대신 **컨텍스트 기반 view 상태**로 처리합니다.

---

## 4. 데이터 구조

```ts
User {
  id, name,
  role,        // employee | teamlead | manager | strategy | executive
  team,        // 소속 팀 (팀장/현업)
  office,      // 소속 실 (실장은 office 단위)
  department   // 본부
}

WeeklyReport {
  id, week, authorId, team, office, title,
  progress, quantitativeValue, qualitativeValue,
  issues, nextPlan, supportNeeded,
  status, createdAt, updatedAt,
  feedbackHistory: Feedback[]
}

Feedback { id, reportId, writerId, writerRole, comment, action, createdAt }

TeamSummary {    // 팀장이 작성, 실장이 검토
  id, week, team, office, leadId, reportIds,
  headline, keyAchievements, issues, status, feedbackHistory[]
}

OfficeSummary {  // 실장이 작성, 전략기획이 취합
  id, week, office, managerId, teamSummaryIds,
  headline, keyAchievements, issues, decisionsNeeded, status
}

ExecutiveSummary {  // 전략기획이 생성, 임원이 코멘트
  id, week, authorId,
  keyAchievements, majorIssues, risks, decisionsNeeded,
  status, execComments[]
}
```

샘플 데이터는 [`src/data/mockData.js`](src/data/mockData.js)에 정의되어 있어 로그인 직후 전체 흐름을 확인할 수 있습니다 (3실·4팀·17명, 2개 주차, 다양한 상태 포함).

---

## 5. 프로젝트 구조

```
src/
├─ App.jsx · main.jsx · styles.css      # 엔트리 / view 라우팅 / 디자인 시스템
├─ context/AppContext.jsx               # 전역 상태 + 액션 + localStorage 영속화
├─ data/  constants.js  mockData.js     # 역할·상태·주차 / 샘플 데이터
├─ utils/ storage.js  aiSummary.js      # localStorage 헬퍼 / Mock AI 요약
├─ components/                          # Login · Layout · StatusBadge · Toast
│                                       #  AISummaryPanel · FeedbackTimeline · ReportView
└─ pages/                               # 역할별 화면
   ├─ EmployeeDashboard · ReportEditor
   ├─ TeamLeadDashboard · ReportDetail · TeamSummary
   ├─ ManagerDashboard · TeamSummaryDetail · OfficeSummaryBuilder
   ├─ StrategyDashboard · ExecSummaryBuilder · ExecutiveDashboard
   └─ FeedbackHistory
```

---

## 6. 설치 및 실행

사전 요구: **Node.js 18+**

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

> **데이터 초기화**: 사이드바 하단 `♻️ 데이터 초기화` 버튼으로 localStorage를 비우고 샘플 데이터로 복원합니다.

### 추천 체험 시나리오 (전체 결재 체인)
1. **팀장(김선우)** → 포털기획팀 보고 검토: 김도현 승인 / 이서연 반려
2. **현업(이서연)** → 반려된 보고 보완 후 재제출
3. **팀장(김선우)** → 팀 요약 작성에서 `AI 일괄 요약` → 실장에 제출
4. **실장(오세훈)** → 팀 요약 승인 → 실 요약 작성 → 전략기획에 제출
5. **전략기획팀(서지안)** → 취합 대시보드 → `AI로 임원 보고 초안 생성` → 제출
6. **임원(노상헌)** → 최종 요약 확인 → 코멘트 등록

---

## 7. 배포 방법 (GitHub Pages)

`vite.config.js`의 `base: './'` 설정으로 저장소 이름과 무관하게 동작합니다.

### 방법 A — GitHub Actions (권장, 자동 배포)
```bash
git init && git add -A && git commit -m "init: WeeklyFlow MVP"
git branch -M main
git remote add origin https://github.com/<계정>/<저장소>.git
git push -u origin main
```
1. 푸시 후 저장소 **Settings → Pages → Build and deployment → Source: GitHub Actions** 선택
2. 이후 `main`에 push할 때마다 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)가 자동 빌드·배포합니다.

### 방법 B — gh-pages 수동 배포
```bash
npm run build
npm run deploy        # dist/ 를 gh-pages 브랜치로 푸시
```
이후 Settings → Pages → Source를 `gh-pages` 브랜치로 지정합니다.

> `gh` CLI가 있으면 `gh repo create <저장소> --public --source=. --remote=origin --push` 한 줄로 저장소 생성·푸시까지 가능합니다.

---

## 8. 향후 고도화 계획

| 영역 | 고도화 방향 |
| --- | --- |
| 협업 도구 연동 | Google Workspace / Microsoft Teams 알림·문서 연동 |
| 알림 자동화 | 제출 마감 임박·미제출자 자동 알림 (메일·메신저) |
| 실제 AI 요약 | LLM 연동 기반 자동 요약·분류·중복 제거 |
| 성과 데이터 축적 | 팀/실/프로젝트별 성과 지표 누적 및 추세 분석 |
| 임원 보고 자동화 | 요약본 기반 PDF/PPT 자동 생성 |
| 인증·권한 | 사내 SSO 연동 및 역할 기반 접근 제어(RBAC) |
| 리스크 탐지 | 보고 데이터 기반 업무 리스크 자동 탐지·경보 |
| 패턴 분석 | 반복 업무·지연 업무·이슈 패턴 분석 |

### MVP 구현 범위
- ✅ Mock Login(5역할 접근 제어), 보고 작성/임시저장/제출, 승인/반려/재제출
- ✅ **팀장 1차 검토 → 실장 2차 검토** 2단계 결재 + 팀 요약 → 실 요약 → 임원 요약 단계별 취합
- ✅ Mock AI 요약(핵심 성과 / 주요 이슈 / 다음 주 중점 / 임원 확인 필요)
- ✅ 제출률·지연 제출자 대시보드, 피드백 이력 타임라인
- ✅ Claude 스타일 디자인, localStorage 영속화, GitHub Pages 배포 구조
- ⛔ 제외: 실제 메일 발송, 실제 AI API, 실제 DB 연동 (Mock으로 대체)

---

*WeeklyFlow는 내부 업무 효율화와 AX 전환 성과를 설명하기 위한 프로토타입입니다.*
