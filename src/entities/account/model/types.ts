import type { IsoDateTimeString } from '../../../shared/model/types/date'
import type { BaseProduct, Currency } from '../../product/model/types'
import type { User } from '../../user/model/types'

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT'
export type AccountStatus = 'ACTIVE' | 'BLOCKED' | 'CLOSED'

/**
 * Account entity.
 */
export interface Account {
	id: number
	accountNumber: string
	type: AccountType
	balance: number
	currency: Currency
	status: AccountStatus
	openedDate: IsoDateTimeString
	owner: User
	product?: BaseProduct | null
}
