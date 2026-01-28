import type { IsoDateTimeString } from '../../../shared/model/types/date'
import type { User } from '../../user/model/types'

export type NotificationType = 'EMAIL' | 'SMS' | 'PUSH'
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED'

/**
 * Notification entity.
 */
export interface Notification {
	id: number
	recipient: User
	type: NotificationType
	subject: string
	content: string
	status: NotificationStatus
	priority: number
	scheduledFor: IsoDateTimeString
	sentAt?: IsoDateTimeString | null
	errorMessage?: string | null
}
