import { baseApi } from '../../../shared/api/base-api'

export interface ReportItem {
	id: string
	name: string
	type: 'SALES' | 'RISK' | 'OPERATIONS'
	status: 'READY' | 'PROCESSING'
	createdAt: string
}

export interface ReportsParams {
	type?: 'SALES' | 'RISK' | 'OPERATIONS'
	status?: 'READY' | 'PROCESSING'
	search?: string
}

export interface GenerateReportRequest {
	type: 'SALES' | 'RISK' | 'OPERATIONS'
	period: string
}

export interface ScheduleReportRequest {
	type: 'SALES' | 'RISK' | 'OPERATIONS'
	cron: string
}

export type ReportFormat = 'PDF' | 'XLSX'

export const reportsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getReports: build.query<ReportItem[], ReportsParams | void>({
			query: (params) => ({
				url: '/v1/reports',
				method: 'GET',
				params,
			}),
		}),
		generateReport: build.mutation<void, GenerateReportRequest>({
			query: (body) => ({
				url: '/v1/reports/generate',
				method: 'POST',
				body,
			}),
		}),
		downloadReport: build.query<unknown, { id: string; format?: ReportFormat }>({
			query: ({ id, format }) => ({
				url: `/v1/reports/${id}/download`,
				method: 'GET',
				params: format ? { format } : undefined,
			}),
		}),
		scheduleReport: build.mutation<void, ScheduleReportRequest>({
			query: (body) => ({
				url: '/v1/reports/scheduled',
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const {
	useLazyGetReportsQuery,
	useGenerateReportMutation,
	useLazyDownloadReportQuery,
	useScheduleReportMutation,
} = reportsApi
