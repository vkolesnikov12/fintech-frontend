import type { IsoDateTimeString } from '../../../shared/model/types/date'
import type { User } from '../../user/model/types'

export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH'

/**
 * Credit score entity.
 */
export interface CreditScore {
	id: number
	client: User
	score: number
	riskCategory: RiskCategory
	maxApprovedAmount: number
	recommendedInterestRate: number
	scoringFactors: Record<string, unknown>
	calculatedAt: IsoDateTimeString
	validUntil: IsoDateTimeString
}
