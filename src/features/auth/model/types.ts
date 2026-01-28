import type { User } from '../../../entities/user/model/types'

export interface LoginRequest {
	login: string
	password: string
}

export interface RegisterRequest {
	username: string
	email: string
	phone: string
	password: string
	firstName: string
	lastName: string
	birthDate: string
}

export interface AuthResponse {
	accessToken: string
	refreshToken: string
	userInfo: User
}
