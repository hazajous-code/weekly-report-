import { useApp } from './context/AppContext'
import Login from './components/Login'
import Layout from './components/Layout'
import Toast from './components/Toast'

import EmployeeDashboard from './pages/EmployeeDashboard'
import ReportEditor from './pages/ReportEditor'
import TeamLeadDashboard from './pages/TeamLeadDashboard'
import ReportDetail from './pages/ReportDetail'
import TeamSummary from './pages/TeamSummary'
import ManagerDashboard from './pages/ManagerDashboard'
import TeamSummaryDetail from './pages/TeamSummaryDetail'
import OfficeSummaryBuilder from './pages/OfficeSummaryBuilder'
import StrategyDashboard from './pages/StrategyDashboard'
import ExecSummaryBuilder from './pages/ExecSummaryBuilder'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import FeedbackHistory from './pages/FeedbackHistory'

const PAGES = {
  'employee-home': EmployeeDashboard,
  'report-editor': ReportEditor,
  'teamlead-home': TeamLeadDashboard,
  'report-detail': ReportDetail,
  'team-summary': TeamSummary,
  'manager-home': ManagerDashboard,
  'team-summary-detail': TeamSummaryDetail,
  'office-summary': OfficeSummaryBuilder,
  'strategy-home': StrategyDashboard,
  'exec-summary-builder': ExecSummaryBuilder,
  'executive-home': ExecutiveDashboard,
  'feedback-history': FeedbackHistory,
}

export default function App() {
  const { currentUser, view, toast, setToast } = useApp()

  if (!currentUser) return <Login />

  const Page = PAGES[view] || EmployeeDashboard

  return (
    <>
      <Layout>
        <Page />
      </Layout>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  )
}
