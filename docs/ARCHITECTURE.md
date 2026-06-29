# WeeklyFlow 아키텍처 설계도

이 문서는 **현재 MVP(As-Is)** 와 **전사 포털 목표(To-Be)** 아키텍처, 결재 워크플로, 데이터 모델, 기술 스택을 정리합니다.
다이어그램은 Mermaid로 작성되어 GitHub에서 바로 렌더링됩니다.

---

## 1. 현재 MVP 아키텍처 (As-Is)

> 백엔드 없이 **브라우저 단독**으로 동작하는 프로토타입. 흐름·UX·데이터 모델 검증이 목적.

```mermaid
flowchart TD
  subgraph Browser["사용자 브라우저 (단말 1대)"]
    UI["React UI (Vite)<br/>역할별 화면 12종"]
    CTX["AppContext<br/>전역 상태 + 액션"]
    AISUM["aiSummary.js<br/>규칙 기반 Mock 요약"]
    LS[("localStorage<br/>reports · summaries")]
    UI <--> CTX
    CTX <--> LS
    CTX --> AISUM
  end

  subgraph Host["GitHub Pages (정적 호스팅)"]
    STATIC["index.html + JS/CSS 번들"]
  end

  STATIC -. "최초 1회 로드" .-> UI

  classDef store fill:#f5e9e2,stroke:#c2613f;
  class LS store;
```

**한계:** 데이터가 단말의 localStorage에만 존재 → 팀장이 팀원 보고를 볼 수 없음. 인증·조직·AI 모두 가짜(Mock).

---

## 2. 전사 포털 목표 아키텍처 (To-Be)

> 계층형(Layered) 구조. **클라이언트 · 엣지 · 애플리케이션 · 데이터 · AI · 연동 · 인프라/보안** 7개 레이어.

```mermaid
flowchart TB
  subgraph CLIENT["① 클라이언트"]
    WEB["웹 (React SPA)"]
    MOBILE["모바일 (반응형/앱)"]
  end

  subgraph EDGE["② 엣지 / 게이트웨이"]
    CDN["CDN"]
    APIGW["API Gateway<br/>인증·라우팅·Rate Limit"]
  end

  subgraph AUTH["③ 인증 / 권한"]
    SSO["사내 SSO<br/>(OIDC / SAML)"]
    RBAC["권한 서비스 (RBAC)<br/>역할=조직 기반 동적 결정"]
  end

  subgraph APP["④ 애플리케이션 서비스"]
    REPORT["보고서 서비스"]
    WF["결재 워크플로 엔진<br/>조직별 결재선·위임"]
    SUMMARY["요약/취합 서비스<br/>팀→실→임원"]
    NOTI["알림 서비스"]
    AUDIT["감사·이력 서비스"]
  end

  subgraph DATA["⑤ 데이터"]
    RDB[("RDB<br/>PostgreSQL")]
    OBJ[("오브젝트 스토리지<br/>첨부파일")]
    SEARCH[("검색엔진<br/>OpenSearch")]
    CACHE[("캐시/큐<br/>Redis")]
  end

  subgraph AI["⑥ AI 계층"]
    GW["사내 LLM 게이트웨이"]
    LLM["요약·분류·중복제거<br/>리스크 탐지"]
  end

  subgraph INTEG["⑦ 외부 연동"]
    HR["HR/조직도<br/>(SAP·Workday)"]
    MSG["메신저<br/>(Teams·Slack·카카오워크)"]
    MAIL["메일 (SMTP)"]
    BI["BI / 데이터웨어하우스"]
  end

  WEB --> CDN --> APIGW
  MOBILE --> APIGW
  APIGW --> SSO
  APIGW --> RBAC
  APIGW --> REPORT & WF & SUMMARY & NOTI & AUDIT

  REPORT --> RDB & OBJ & SEARCH
  WF --> RDB
  SUMMARY --> RDB
  SUMMARY --> GW --> LLM
  NOTI --> MSG & MAIL
  NOTI --> CACHE
  AUDIT --> RDB

  RBAC -. "조직·인사이동 동기화" .- HR
  REPORT -. "성과 데이터 적재" .-> BI

  classDef sec fill:#f5e9e2,stroke:#c2613f,stroke-width:1px;
  class SSO,RBAC sec;
```

### 레이어별 책임 요약

| 레이어 | 책임 | 대표 구성요소 |
|---|---|---|
| ① 클라이언트 | 화면·입력·시각화 | React SPA, 모바일 |
| ② 엣지/게이트웨이 | 분산·캐싱·인증 위임·트래픽 제어 | CDN, API Gateway |
| ③ 인증/권한 | 신원 확인, 역할 기반 접근통제 | SSO(OIDC/SAML), RBAC |
| ④ 애플리케이션 | 도메인 로직(보고·결재·요약·알림·감사) | 마이크로/모듈러 서비스 |
| ⑤ 데이터 | 영속·검색·캐시·파일 | PostgreSQL, OpenSearch, Redis, 오브젝트 스토리지 |
| ⑥ AI | 요약·분류·리스크 탐지(사내 보안 경유) | LLM 게이트웨이 |
| ⑦ 연동 | 조직도·알림·BI 연계 | HR, 메신저, 메일, DWH |

> **보안/컴플라이언스**는 전 레이어 횡단 관심사: 전송·저장 암호화, 감사로그, 개인정보(PII) 마스킹, 보존정책, ISMS/보안심의.

---

## 3. 결재 워크플로 (시퀀스)

> 현업 → 팀장 → 실장 → 전략기획팀 → 임원. 각 단계 승인/반려 + 단계별 자동 취합.

```mermaid
sequenceDiagram
  actor E as 현업 담당자
  actor L as 팀장
  actor M as 실장
  actor S as 전략기획팀
  actor X as 임원
  participant SYS as WeeklyFlow

  E->>SYS: 주간보고 작성·제출
  SYS-->>L: 제출 알림
  alt 반려
    L-->>E: 반려 + 피드백
    E->>SYS: 보완 후 재제출
  else 승인
    L->>SYS: 승인
  end
  L->>SYS: 승인 보고 → 팀 요약 작성·제출 (AI 요약)
  SYS-->>M: 팀 요약 제출 알림
  M->>SYS: 팀 요약 검토(승인/반려) → 실 요약 작성·제출
  SYS-->>S: 실 요약 제출 알림
  S->>SYS: 실별 요약 취합 → AI 임원 보고 초안 → 제출
  SYS-->>X: 임원 보고 도착
  X->>SYS: 확인 + 의사결정 코멘트
  SYS-->>S: 코멘트 회신
```

---

## 4. 데이터 모델 (ER 개요)

```mermaid
erDiagram
  USER ||--o{ WEEKLY_REPORT : writes
  USER ||--o{ FEEDBACK : writes
  WEEKLY_REPORT ||--o{ FEEDBACK : has
  WEEKLY_REPORT }o--|| TEAM_SUMMARY : "rolled into"
  TEAM_SUMMARY }o--|| OFFICE_SUMMARY : "rolled into"
  OFFICE_SUMMARY }o--|| EXEC_SUMMARY : "rolled into"
  EXEC_SUMMARY ||--o{ EXEC_COMMENT : has

  USER {
    id PK
    name
    role
    team
    office
    department
  }
  WEEKLY_REPORT {
    id PK
    week
    authorId FK
    team
    office
    title
    progress
    status
  }
  FEEDBACK {
    id PK
    reportId FK
    writerId FK
    action
    comment
  }
  TEAM_SUMMARY {
    id PK
    week
    team
    leadId FK
    status
  }
  OFFICE_SUMMARY {
    id PK
    week
    office
    managerId FK
    status
  }
  EXEC_SUMMARY {
    id PK
    week
    authorId FK
    status
  }
```

> 현재 MVP의 `src/data/mockData.js` 스키마가 그대로 테이블로 승격 가능합니다. 전사 전환 시 추가: 감사로그·버전 이력·첨부파일·조직 마스터(동기화) 테이블.

---

## 5. 기술 스택 제안

| 영역 | MVP(현재) | 전사(목표) |
|---|---|---|
| 프론트엔드 | React 18 + Vite | 동일 + 라우터·서버상태(React Query)·디자인시스템 |
| 백엔드 | 없음 | Node(NestJS) 또는 Spring Boot, REST/GraphQL |
| 인증 | Mock | 사내 SSO(OIDC/SAML), JWT, RBAC |
| DB | localStorage | PostgreSQL + Redis + OpenSearch |
| 파일 | 없음 | S3 호환 오브젝트 스토리지 |
| AI | 규칙 기반 Mock | 사내 LLM 게이트웨이(프라이빗) |
| 알림 | Mock | 메일 + Teams/Slack/카카오워크 |
| 배포 | GitHub Pages | 컨테이너(K8s)/사내 클라우드, CI/CD, 모니터링·DR |

---

## 6. 단계적 전환 로드맵

```mermaid
flowchart LR
  P1["Phase 1<br/>백엔드+SSO+조직연동<br/>(한 본부 파일럿)"]
  P2["Phase 2<br/>결재선 어드민·알림<br/>보안심의 (다부서)"]
  P3["Phase 3<br/>실제 LLM·BI<br/>(AX 성과 입증)"]
  P4["Phase 4<br/>SLA·DR·교육<br/>(전사 GA)"]
  P1 --> P2 --> P3 --> P4
```

전략: **"파일럿 → 절감효과 수치 입증 → 확산"**. 처음부터 전사 오픈은 결재선 다양성·보안 리스크로 위험.
