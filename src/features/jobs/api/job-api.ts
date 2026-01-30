import { baseApi } from '../../../shared/api/base-api'

export interface JobItem {
	id: string
	name: string
	type: string
	schedule: string
	status: 'ACTIVE' | 'PAUSED'
	lastRun: string
}

export interface JobFilterParams {
	type?: string
	status?: string
}

export interface ScheduleJobRequest {
	jobType: string
	cron: string
}

export interface ExecuteJobRequest {
	jobType: string
}

export const jobApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getJobs: build.query<JobItem[], JobFilterParams | void>({
			query: (params) => ({
				url: '/v1/jobs',
				method: 'GET',
				params,
			}),
		}),
		getJobTypes: build.query<string[], void>({
			query: () => ({
				url: '/v1/jobs/types',
				method: 'GET',
			}),
		}),
		scheduleJob: build.mutation<void, ScheduleJobRequest>({
			query: (body) => ({
				url: '/v1/jobs/schedule',
				method: 'POST',
				body,
			}),
		}),
		executeJob: build.mutation<void, ExecuteJobRequest>({
			query: (body) => ({
				url: '/v1/jobs/execute',
				method: 'POST',
				body,
			}),
		}),
		cancelJob: build.mutation<void, { id: string }>({
			query: ({ id }) => ({
				url: `/v1/jobs/${id}/cancel`,
				method: 'POST',
			}),
		}),
	}),
})

export const {
	useLazyGetJobsQuery,
	useLazyGetJobTypesQuery,
	useScheduleJobMutation,
	useExecuteJobMutation,
	useCancelJobMutation,
} = jobApi
