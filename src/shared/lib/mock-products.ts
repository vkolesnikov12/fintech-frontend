export type MockProductType = 'CREDIT' | 'DEPOSIT' | 'INVESTMENT'

export interface MockProduct {
	id: number
	name: string
	code: string
	type: MockProductType
	rate: string
	currency: string
	status: 'ACTIVE' | 'INACTIVE'
	updatedAt: string
}

export const mockProducts: MockProduct[] = [
	{
		id: 1,
		name: 'Кредит наличными',
		code: 'CRD-001',
		type: 'CREDIT',
		rate: '12.5%',
		currency: 'RUB',
		status: 'ACTIVE',
		updatedAt: '19.01.2026',
	},
	{
		id: 2,
		name: 'Депозит «Надежный»',
		code: 'DEP-008',
		type: 'DEPOSIT',
		rate: '8.2%',
		currency: 'RUB',
		status: 'ACTIVE',
		updatedAt: '15.01.2026',
	},
	{
		id: 3,
		name: 'Инвестиционный пакет',
		code: 'INV-010',
		type: 'INVESTMENT',
		rate: '10.1%',
		currency: 'USD',
		status: 'INACTIVE',
		updatedAt: '10.01.2026',
	},
]
