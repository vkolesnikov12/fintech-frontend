import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AccountsPage } from './pages/accounts-page'
import { DashboardPage } from './pages/dashboard-page'
import { LoginPage } from './pages/login-page'
import { ProfilePage } from './pages/profile-page'
import { RegisterPage } from './pages/register-page'
import { StubPage } from './pages/stub-page'
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
					<Route
						path='transfers'
						element={<StubPage title='Переводы' />}
					/>
					<Route path='cards' element={<StubPage title='Карты' />} />
					<Route
						path='documents'
						element={<StubPage title='Документы' />}
					/>
					<Route path='profile' element={<ProfilePage />} />
					<Route
						path='settings'
						element={<StubPage title='Настройки' />}
					/>
					<Route
						path='support'
						element={<StubPage title='Поддержка' />}
					/>
					<Route
						path='users'
						element={<StubPage title='Пользователи' />}
					/>
					<Route
						path='products'
						element={<StubPage title='Продукты' />}
					/>
				</Route>
			</Route>
		</Routes>
	)
}

export default App
