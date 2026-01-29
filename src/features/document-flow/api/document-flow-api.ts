import { baseApi } from '../../../shared/api/base-api'

export interface DocumentSearchParams {
	status?: string
	client?: string
	application?: string
}

export interface DocumentStatusRequest {
	id: string
	status: 'APPROVED' | 'REJECTED' | 'REQUESTED'
}

export interface NotificationRequest {
	recipientId?: number
	applicationId?: number
	message: string
}

export const documentFlowApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		searchDocuments: build.query<unknown, DocumentSearchParams | void>({
			query: (params) => ({
				url: '/v1/documents/search',
				method: 'GET',
				params,
			}),
		}),
		downloadDocument: build.query<unknown, { id: string }>({
			query: ({ id }) => ({
				url: `/v1/documents/${id}/download`,
				method: 'GET',
			}),
		}),
		updateDocumentStatus: build.mutation<void, DocumentStatusRequest>({
			query: ({ id, status }) => ({
				url: `/v1/documents/${id}/status`,
				method: 'PATCH',
				body: { status },
			}),
		}),
		sendNotification: build.mutation<void, NotificationRequest>({
			query: (body) => ({
				url: '/v1/notifications/send',
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const {
	useLazySearchDocumentsQuery,
	useLazyDownloadDocumentQuery,
	useUpdateDocumentStatusMutation,
	useSendNotificationMutation,
} = documentFlowApi
