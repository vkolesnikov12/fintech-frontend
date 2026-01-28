import type { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { UserRole } from '../../entities/user/model/types'
import { ensureMockSession, getSessionUser } from '../lib/auth-session'
import { getAccessToken } from '../lib/token-storage'

interface ProtectedRouteProps {
	allowedRoles?: UserRole[]
	redirectTo?: string
}

export function ProtectedRoute({
	allowedRoles,
	redirectTo = '/login',
}: ProtectedRouteProps): ReactElement {
	ensureMockSession()

	const accessToken = getAccessToken()
	const user = getSessionUser()

	if (!accessToken) {
		return <Navigate to={redirectTo} replace />
	}

	if (allowedRoles && user && !allowedRoles.includes(user.role)) {
		return <Navigate to='/app' replace />
	}

	return <Outlet />
}
