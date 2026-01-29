import type { User, UserRole } from '../../entities/user/model/types'
import { getAccessToken, setTokens } from './token-storage'

const USER_KEY = 'bankfintech_user'

const MOCK_USER: User = {
	id: 1,
	username: 'vitaly',
	email: 'vitaly@bankfintech.ru',
	phone: '+7 (900) 000-00-00',
	passwordHash: '',
	firstName: 'Виталий',
	lastName: 'Иванов',
	birthDate: '1992-02-14',
	registrationDate: '2026-01-10T10:30:00Z',
	role: 'CLIENT',
	active: true,
}

export const isMockAuthEnabled = () =>
	import.meta.env.VITE_MOCK_AUTH === 'true'

export const getForcedRole = (): UserRole | null => {
	const role = import.meta.env.VITE_FORCE_ROLE

	if (role === 'CLIENT' || role === 'MANAGER' || role === 'ADMIN') {
		return role
	}

	return null
}

export const getSessionUser = (): User | null => {
	const stored = localStorage.getItem(USER_KEY)

	if (!stored) {
		return null
	}

	try {
		return JSON.parse(stored) as User
	} catch {
		return null
	}
}

export const setSessionUser = (user: User) => {
	localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const updateSessionUser = (payload: Partial<User>) => {
	const current = getSessionUser()

	if (!current) {
		return
	}

	const nextUser = {
		...current,
		...payload,
	}

	setSessionUser(nextUser)
}

export const clearSessionUser = () => {
	localStorage.removeItem(USER_KEY)
}

export const getUserRole = (): UserRole | null => {
	const forcedRole = getForcedRole()

	if (forcedRole) {
		return forcedRole
	}

	const user = getSessionUser()

	return user?.role ?? null
}

export const ensureMockSession = () => {
	if (!isMockAuthEnabled()) {
		return
	}

	if (!getAccessToken()) {
		setTokens({
			accessToken: 'mock-access-token',
			refreshToken: 'mock-refresh-token',
		})
	}

	if (!getSessionUser()) {
		const forcedRole = getForcedRole()
		const mockUser = forcedRole
			? { ...MOCK_USER, role: forcedRole }
			: MOCK_USER

		setSessionUser(mockUser)
	}
}
