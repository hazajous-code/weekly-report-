// Mock AI 요약 유틸
// 실제 AI API 연동 대신, 보고서 필드를 규칙 기반으로 취합/정제해
// "핵심 성과 / 주요 이슈 / 다음 주 중점 사항 / 임원 확인 필요 사항" 4개 섹션을 생성합니다.

const clean = (v) => (v || '').trim()
const isEmpty = (v) => !clean(v) || ['없음', '특이사항 없음', '-'].includes(clean(v))

function splitLines(text) {
  return clean(text)
    .split(/\n|·|•|\/|,(?=\s)/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// 여러 보고서를 받아 4개 섹션의 요약 객체를 반환
export function summarizeReports(reports, { teamName } = {}) {
  const keyAchievements = []
  const majorIssues = []
  const nextFocus = []
  const execAttention = []

  reports.forEach((r) => {
    const tag = `[${r.team}] ${r.title}`

    if (!isEmpty(r.quantitativeValue)) {
      keyAchievements.push(`${tag}: ${clean(r.quantitativeValue)}`)
    } else if (!isEmpty(r.qualitativeValue)) {
      keyAchievements.push(`${tag}: ${clean(r.qualitativeValue)}`)
    }

    if (!isEmpty(r.issues)) {
      majorIssues.push(`${tag}: ${clean(r.issues)}`)
    }

    if (!isEmpty(r.nextPlan)) {
      nextFocus.push(`${tag}: ${clean(r.nextPlan)}`)
    }

    // 지원 요청 또는 이슈가 있으면 임원 확인 후보로 분류
    if (!isEmpty(r.supportNeeded)) {
      execAttention.push(`${tag} — 지원 필요: ${clean(r.supportNeeded)}`)
    }
  })

  return {
    generatedAt: new Date().toISOString(),
    scope: teamName || `${reports.length}개 보고서`,
    keyAchievements,
    majorIssues,
    nextFocus,
    execAttention,
  }
}

// 단일 보고서 요약 (작성 화면에서 미리보기용)
export function summarizeSingle(report) {
  return {
    keyAchievements: [report.quantitativeValue, report.qualitativeValue]
      .map(clean)
      .filter((v) => v && !isEmpty(v)),
    majorIssues: splitLines(report.issues).filter((v) => !isEmpty(v)),
    nextFocus: splitLines(report.nextPlan),
    execAttention: isEmpty(report.supportNeeded) ? [] : [clean(report.supportNeeded)],
  }
}

// 임원 보고용 텍스트 초안 생성 (전략기획팀 빌더에서 사용)
export function buildExecDraft(summary) {
  const toText = (arr) => (arr.length ? arr.map((x) => `· ${x}`).join('\n') : '· 해당 없음')
  return {
    keyAchievements: toText(summary.keyAchievements),
    majorIssues: toText(summary.majorIssues),
    risks: toText(summary.majorIssues), // 이슈 기반 리스크 초안
    decisionsNeeded: toText(summary.execAttention),
  }
}
