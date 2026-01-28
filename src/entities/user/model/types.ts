import type { IsoDateString, IsoDateTimeString } from '../../../shared/model/types/date'

export type UserRole = 'CLIENT' | 'MANAGER' | 'ADMIN'

/**
 * User entity.
 */
export interface User {
	id: number
	username: string
	email: string
	phone: string
	passwordHash: string
	firstName: string
	lastName: string
	birthDate: IsoDateString
	registrationDate: IsoDateTimeString
	role: UserRole
	active: boolean
}
