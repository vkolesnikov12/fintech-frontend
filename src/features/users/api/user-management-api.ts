import { baseApi } from '../../../shared/api/base-api'

export interface UserSearchParams {
	role?: 'CLIENT' | 'MANAGER' | 'ADMIN'
	status?: 'ACTIVE' | 'BLOCKED'
	query?: string
}

export interface UserStatusRequest {
	id: string
	status: 'ACTIVE' | 'BLOCKED'
}

export const userManagementApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		searchUsers: build.query<unknown, UserSearchParams | void>({
			query: (params) => ({
				url: '/v1/users/search',
				method: 'GET',
				params,
			}),
		}),
		updateUserStatus: build.mutation<void, UserStatusRequest>({
			query: ({ id, status }) => ({
				url: `/v1/users/${id}/status`,
				method: 'PATCH',
				body: { status },
			}),
		}),
		getUserAudit: build.query<unknown, { id: string }>({
			query: ({ id }) => ({
				url: `/v1/users/${id}/audit`,
				method: 'GET',
			}),
		}),
		resetPassword: build.mutation<void, { login: string }>({
			query: (body) => ({
				url: '/v1/auth/password/reset-request',
				method: 'POST',
				body,
			}),
		}),
		registerEmployee: build.mutation<void, {
			username: string
			email: string
			phone: string
			role: 'MANAGER' | 'ADMIN'
			password?: string
		}>({
			query: (body) => ({
				url: '/v1/auth/register',
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const {
	useLazySearchUsersQuery,
	useUpdateUserStatusMutation,
	useLazyGetUserAuditQuery,
	useResetPasswordMutation,
	useRegisterEmployeeMutation,
} = userManagementApi
