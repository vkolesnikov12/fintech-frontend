import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AccountsPage } from './pages/accounts-page'
import { ApplicationsPage } from './pages/applications-page'
import { CardsPage } from './pages/cards-page'
import { DashboardPage } from './pages/dashboard-page'
import { DocumentsPage } from './pages/documents-page'
import { LoginPage } from './pages/login-page'
import { LoanPaymentsPage } from './pages/loan-payments-page'
import { NotificationsPage } from './pages/notifications-page'
import { ProfileSettingsPage } from './pages/profile-settings-page'
import { RegisterPage } from './pages/register-page'
import { StubPage } from './pages/stub-page'
import { TransfersPage } from './pages/transfers-page'
import { ManagerDashboardPage } from './pages/manager-dashboard-page'
import { ApplicationPipelinePage } from './pages/application-pipeline-page'
import { ApplicationDetailsPage } from './pages/application-details-page'
import { DocumentFlowPage } from './pages/document-flow-page'
import { ProductManagementPage } from './pages/product-management-page'
import { SystemMonitoringPage } from './pages/system-monitoring-page'
import { UserManagementPage } from './pages/user-management-page'
import { JobManagementPage } from './pages/job-management-page'
import { SystemConfigurationPage } from './pages/system-configuration-page'
import { AnalyticsReportsPage } from './pages/analytics-reports-page'
import { ProtectedRoute } from './shared/ui/protected-route'
import { MainLayout } from './widgets/main-layout/ui/main-layout'

function App() {
	return (
		<Routes>
			<Route path='/' element={<Navigate to='/login' replace />} />
			<Route path='/login' element={<LoginPage />} />
			<Route path='/register' element={<RegisterPage />} />
			<Route element={<ProtectedRoute />}>
				<Route path='/app' element={<MainLayout />}>
					<Route index element={<DashboardPage />} />
					<Route path='accounts' element={<AccountsPage />} />
					<Route path='transfers' element={<TransfersPage />} />
					<Route path='cards' element={<CardsPage />} />
					<Route path='documents' element={<DocumentsPage />} />
					<Route path='applications' element={<ApplicationsPage />} />
					<Route path='loan-payments' element={<LoanPaymentsPage />} />
					<Route path='notifications' element={<NotificationsPage />} />
					<Route
						path='profile'
						element={<Navigate to='/app/profile-settings' replace />}
					/>
					<Route path='profile-settings' element={<ProfileSettingsPage />} />
					<Route element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
						<Route
							path='manager-dashboard'
							element={<ManagerDashboardPage />}
						/>
						<Route
							path='application-pipeline'
							element={<ApplicationPipelinePage />}
						/>
						<Route
							path='document-flow'
							element={<DocumentFlowPage />}
						/>
						<Route
							path='applications/:applicationId'
							element={<ApplicationDetailsPage />}
						/>
						<Route path='products' element={<ProductManagementPage />} />
						<Route
							path='system-monitoring'
							element={<SystemMonitoringPage />}
						/>
						<Route path='users' element={<UserManagementPage />} />
						<Route path='job-management' element={<JobManagementPage />} />
						<Route
							path='system-configuration'
							element={<SystemConfigurationPage />}
						/>
						<Route
							path='analytics-reports'
							element={<AnalyticsReportsPage />}
						/>
					</Route>
					<Route
						path='settings'
						element={<StubPage title='Настройки' />}
					/>
					<Route
						path='support'
						element={<StubPage title='Поддержка' />}
					/>
				</Route>
			</Route>
		</Routes>
	)
}

export default App
