import type { IsoDateTimeString } from '../../../shared/model/types/date'
import type { Account } from '../../account/model/types'
import type { BaseProduct, Currency } from '../../product/model/types'
import type { User } from '../../user/model/types'

export type ApplicationStatus =
	| 'NEW'
	| 'PROCESSING'
	| 'APPROVED'
	| 'REJECTED'

/**
 * Application entity.
 */
export interface Application {
	id: number
	amount: number
	term: number
	currency: Currency
	status: ApplicationStatus
	client: User
	product: BaseProduct
	targetAccount?: Account | null
	createdAt: IsoDateTimeString
	updatedAt: IsoDateTimeString
	processedAt?: IsoDateTimeString | null
	rejectionReason?: string | null
	approvedAmount?: number | null
	approvedTerm?: number | null
	approvedInterestRate?: number | null
}
