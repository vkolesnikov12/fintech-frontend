import { baseApi } from '../../../shared/api/base-api'
import type { UpdateUserRequest, User } from '../model/types'

interface UpdateUserParams {
	id: number
	payload: UpdateUserRequest
}

export const userApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		updateUser: build.mutation<User, UpdateUserParams>({
			query: ({ id, payload }) => ({
				url: `/users/${id}`,
				method: 'PUT',
				body: payload,
			}),
		}),
	}),
})

export const { useUpdateUserMutation } = userApi
