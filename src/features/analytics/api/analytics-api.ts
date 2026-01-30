import { baseApi } from '../../../shared/api/base-api'

export interface AnalyticsWidget {
	id: number
	title: string
	value: string
	trend: string
}

export interface AnalyticsWidgetsParams {
	period?: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
}

export interface DashboardParams {
	type?: 'SALES' | 'RISK' | 'OPERATIONS'
}

export const analyticsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAnalyticsWidgets: build.query<AnalyticsWidget[], AnalyticsWidgetsParams | void>({
			query: (params) => ({
				url: '/v1/analytics/widgets',
				method: 'GET',
				params,
			}),
		}),
		getAnalyticsDashboard: build.query<unknown, DashboardParams | void>({
			query: (params) => ({
				url: '/v1/analytics/dashboard',
				method: 'GET',
				params,
			}),
		}),
	}),
})

export const {
	useLazyGetAnalyticsWidgetsQuery,
	useLazyGetAnalyticsDashboardQuery,
} = analyticsApi
