import type { IsoDateTimeString } from '../../../shared/model/types/date'
import type { Account } from '../../account/model/types'
import type { Currency } from '../../product/model/types'

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FEE'
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED'

/**
 * Transaction entity.
 */
export interface Transaction {
	id: number
	type: TransactionType
	amount: number
	currency: Currency
	fromAccount?: Account | null
	toAccount?: Account | null
	description: string
	status: TransactionStatus
	createdAt: IsoDateTimeString
	referenceId: string
}
