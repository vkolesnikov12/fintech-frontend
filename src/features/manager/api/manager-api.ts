import { baseApi } from '../../../shared/api/base-api'

export interface DailyReportResponse {
	date: string
	totalApplications: number
	approved: number
	rejected: number
	avgProcessingHours: number
}

export interface TeamActivityItem {
	managerId: number
	name: string
	status: 'ONLINE' | 'REVIEWING' | 'OFFLINE'
	completed: number
	progress: number
}

export interface ManagerApplication {
	id: string
	title: string
	client: string
	amount: string
	createdAt: string
	product: string
	status: string
}

export interface ManagerApplicationsParams {
	assigned?: boolean
	status?: string
	product?: string
	search?: string
	sort?: string
}

export interface BulkStatusRequest {
	ids: string[]
	action: 'ASSIGN' | 'APPROVE' | 'REJECT'
}

export interface AssignRequest {
	id: string
	managerId: number
}

export interface AssignResponse {
	applicationId: string
	assignedTo: number
	status: 'ASSIGNED'
}

export const managerApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getDailyReport: build.query<DailyReportResponse, void>({
			query: () => ({
				url: '/v1/reports/daily',
				method: 'GET',
			}),
		}),
		getTeamActivity: build.query<TeamActivityItem[], void>({
			query: () => ({
				url: '/v1/analytics/team/activity',
				method: 'GET',
			}),
		}),
		getManagerApplications: build.query<
			ManagerApplication[],
			ManagerApplicationsParams | void
		>({
			query: (params) => ({
				url: '/v1/manager/applications',
				method: 'GET',
				params,
			}),
		}),
		bulkStatus: build.mutation<void, BulkStatusRequest>({
			query: (body) => ({
				url: '/v1/manager/applications/bulk-status',
				method: 'POST',
				body,
			}),
		}),
		assignApplication: build.mutation<AssignResponse, AssignRequest>({
			query: ({ id, managerId }) => ({
				url: `/v1/manager/applications/${id}/assign`,
				method: 'PATCH',
				body: { managerId },
			}),
		}),
	}),
})

export const {
	useLazyGetDailyReportQuery,
	useLazyGetTeamActivityQuery,
	useLazyGetManagerApplicationsQuery,
	useBulkStatusMutation,
	useAssignApplicationMutation,
} = managerApi
