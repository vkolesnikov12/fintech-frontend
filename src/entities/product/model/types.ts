import type { IsoDateTimeString } from '../../../shared/model/types/date'

export type ProductType = 'CREDIT' | 'DEPOSIT' | 'INVESTMENT'
export type Currency = 'RUB' | 'USD' | 'EUR'

export type CreditType = 'CONSUMER' | 'MORTGAGE' | 'AUTO'
export type RepaymentSchedule = 'ANNUITY' | 'DIFFERENTIATED'

export interface ProductDTO {
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

export interface CreditProductDetailDTO {
	creditType: CreditType
	requiresCollateral: boolean
	repaymentSchedule: RepaymentSchedule
	termMonths: number
	earlyRepaymentFee: number
}

export interface DepositProductDetailDTO {
	replenishable: boolean
	earlyWithdrawalAllowed: boolean
	earlyWithdrawalPenalty: number
	termDays: number
	minBalanceForInterest: number
}

export interface ProductDetailDTO extends ProductDTO {
	creditDetails?: CreditProductDetailDTO | null
	depositDetails?: DepositProductDetailDTO | null
}

export interface CreditProductRequest {
	creditType: CreditType
	requiresCollateral: boolean
	repaymentSchedule: RepaymentSchedule
	termMonths: number
	earlyRepaymentFee?: number
}

export interface DepositProductRequest {
	replenishable: boolean
	earlyWithdrawalAllowed: boolean
	earlyWithdrawalPenalty?: number
	termDays: number
	minBalanceForInterest?: number
}

export interface CreateProductRequest {
	code: string
	name: string
	description?: string
	type: ProductType
	interestRate: number
	minAmount: number
	maxAmount: number
	currency: Currency
	active?: boolean
	creditProduct?: CreditProductRequest
	depositProduct?: DepositProductRequest
}

export interface CreditProductUpdateRequest {
	creditType?: CreditType
	requiresCollateral?: boolean
	repaymentSchedule?: RepaymentSchedule
	termMonths?: number
	earlyRepaymentFee?: number
}

export interface DepositProductUpdateRequest {
	replenishable?: boolean
	earlyWithdrawalAllowed?: boolean
	earlyWithdrawalPenalty?: number
	termDays?: number
	minBalanceForInterest?: number
}

export interface UpdateProductRequest {
	name?: string
	description?: string
	interestRate?: number
	minAmount?: number
	maxAmount?: number
	currency?: Currency
	active?: boolean
	creditProduct?: CreditProductUpdateRequest
	depositProduct?: DepositProductUpdateRequest
}

export interface UpdateStatusRequest {
	active: boolean
}

export interface PageProductDTO {
	totalElements: number
	totalPages: number
	first: boolean
	last: boolean
	size: number
	number: number
	numberOfElements: number
	empty: boolean
	content: ProductDTO[]
}

export type BaseProduct = ProductDTO
