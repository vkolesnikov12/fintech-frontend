import type { IsoDateTimeString } from '../../../shared/model/types/date'

export type ProductType = 'CREDIT' | 'DEPOSIT' | 'INVESTMENT'
export type Currency = 'RUB' | 'USD' | 'EUR'

/**
 * Base financial product.
 */
export interface BaseProduct {
	id: number
	code: string
	name: string
	description: string
	type: ProductType
	interestRate: number
	minAmount: number
	maxAmount: number
	currency: Currency
	active: boolean
	createdAt: IsoDateTimeString
	updatedAt: IsoDateTimeString
}

export type CreditType = 'CONSUMER' | 'MORTGAGE' | 'AUTO'
export type RepaymentSchedule = 'ANNUITY' | 'DIFFERENTIATED'

/**
 * Credit product.
 */
export interface CreditProduct extends BaseProduct {
	creditType: CreditType
	requiresCollateral: boolean
	repaymentSchedule: RepaymentSchedule
	termMonths: number
	earlyRepaymentFee: number
}

/**
 * Deposit product.
 */
export interface DepositProduct extends BaseProduct {
	replenishable: boolean
	earlyWithdrawalAllowed: boolean
	earlyWithdrawalPenalty: number
	termDays: number
	minBalanceForInterest: number
}
