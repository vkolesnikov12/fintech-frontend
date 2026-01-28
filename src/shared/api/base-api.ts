import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAccessToken } from '../lib/token-storage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: API_BASE_URL,
		prepareHeaders: (headers) => {
			const accessToken = getAccessToken()

			if (accessToken) {
				headers.set('Authorization', `Bearer ${accessToken}`)
			}

			return headers
		},
	}),
	endpoints: () => ({}),
})
