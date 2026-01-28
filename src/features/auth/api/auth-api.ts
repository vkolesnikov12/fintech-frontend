import { baseApi } from '../../../shared/api/base-api'
import { setSessionUser } from '../../../shared/lib/auth-session'
import { setTokens } from '../../../shared/lib/token-storage'
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
} from '../model/types'

export const authApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<AuthResponse, LoginRequest>({
			query: (body) => ({
				url: '/auth/login',
				method: 'POST',
				body,
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					setTokens({
						accessToken: data.accessToken,
						refreshToken: data.refreshToken,
					})
					setSessionUser(data.userInfo)
				} catch {
					// handled in UI
				}
			},
		}),
		register: build.mutation<AuthResponse, RegisterRequest>({
			query: (body) => ({
				url: '/auth/register',
				method: 'POST',
				body,
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					setTokens({
						accessToken: data.accessToken,
						refreshToken: data.refreshToken,
					})
					setSessionUser(data.userInfo)
				} catch {
					// handled in UI
				}
			},
		}),
	}),
})

export const {
	useLoginMutation,
	useRegisterMutation,
} = authApi
