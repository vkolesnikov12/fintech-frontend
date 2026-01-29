import {
	BankOutlined,
	DownloadOutlined,
	SearchOutlined,
	WalletOutlined,
} from '@ant-design/icons'
import {
	Button,
	Input,
	Modal,
	Segmented,
	Select,
	Typography,
	message,
} from 'antd'
import { useMemo, useState } from 'react'
import './accounts-page.css'

const { Title, Text } = Typography

const initialAccounts = [
	{
		id: 1,
		title: 'Основной счёт',
		balance: '70 355.19 ₽',
		status: 'АКТИВЕН',
		mask: '**** 4589',
		kind: 'CHECKING',
		icon: <WalletOutlined />,
	},
	{
		id: 2,
		title: 'Накопительный счёт',
		balance: '679 500.00 ₽',
		status: 'АКТИВЕН',
		mask: '**** 9021',
		kind: 'SAVINGS',
		icon: <BankOutlined />,
	},
	{
		id: 3,
		title: 'Кредитный счёт для путешествий',
		balance: '30 000.00 ₽',
		status: 'АКТИВЕН',
		mask: '**** 2234',
		kind: 'CREDIT',
		icon: <BankOutlined />,
	},
]

const transactionsByAccount = {
	1: [
		{
			id: 1,
			title: 'Яндекс музыка',
			subtitle: 'Подписка',
			category: 'Развлечения',
			date: '19.01.2026',
			amount: '-200.00 ₽',
		},
		{
			id: 2,
			title: 'Uber',
			subtitle: 'Такси',
			category: 'Транспорт',
			date: '19.01.2026',
			amount: '-437.00 ₽',
		},
	],
	2: [
		{
			id: 3,
			title: 'TechCorp Inc.',
			subtitle: 'Прямой депозит',
			category: 'Доход',
			date: '19.01.2026',
			amount: '+20 099.00 ₽',
		},
		{
			id: 4,
			title: 'Пятёрочка',
			subtitle: 'Магазин',
			category: 'Еда',
			date: '19.01.2026',
			amount: '-8 331.76 ₽',
		},
	],
	3: [
		{
			id: 5,
			title: 'Аэрофлот',
			subtitle: 'Билеты',
			category: 'Путешествия',
			date: '18.01.2026',
			amount: '-12 450.00 ₽',
		},
		{
			id: 6,
			title: 'Возврат',
			subtitle: 'Кэшбэк',
			category: 'Доход',
			date: '17.01.2026',
			amount: '+1 200.00 ₽',
		},
	],
} as const

export function AccountsPage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [accounts, setAccounts] = useState(initialAccounts)
	const [activeAccountId, setActiveAccountId] = useState(initialAccounts[0].id)
	const [selectedAccount, setSelectedAccount] = useState<typeof initialAccounts[number] | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortValue, setSortValue] = useState('date_desc')
	const [segmentValue, setSegmentValue] = useState('Все транзакции')

	const filteredTransactions = useMemo(() => {
		const sourceTransactions =
			transactionsByAccount[activeAccountId as keyof typeof transactionsByAccount] ?? []
		const query = searchQuery.trim().toLowerCase()
		const filtered = sourceTransactions.filter((item) => {
			const inSegment =
				segmentValue === 'Все транзакции' ||
				(segmentValue === 'Доходы' && item.amount.startsWith('+')) ||
				(segmentValue === 'Расходы' && item.amount.startsWith('-'))

			if (!inSegment) {
				return false
			}

			if (!query) {
				return true
			}

			return (
				item.title.toLowerCase().includes(query) ||
				item.subtitle.toLowerCase().includes(query) ||
				item.category.toLowerCase().includes(query)
			)
		})

		return filtered.sort((a, b) => {
			if (sortValue === 'amount_desc' || sortValue === 'amount_asc') {
				const parseAmount = (value: string) =>
					Number(value.replace(/[^\d.-]/g, ''))
				const diff = parseAmount(a.amount) - parseAmount(b.amount)

				return sortValue === 'amount_desc' ? -diff : diff
			}

			const parseDate = (value: string) => {
				const [day, month, year] = value.split('.').map(Number)
				return new Date(year, month - 1, day).getTime()
			}
			const diff = parseDate(a.date) - parseDate(b.date)

			return sortValue === 'date_desc' ? -diff : diff
		})
	}, [activeAccountId, searchQuery, segmentValue, sortValue])

	const handleStatusChange = (id: number, status: string) => {
		setAccounts((prev) =>
			prev.map((account) =>
				account.id === id ? { ...account, status } : account,
			),
		)
		messageApi.success(`PATCH /api/v1/accounts/${id}/status (mock)`)
	}

	const handleCloseAccount = (id: number) => {
		setAccounts((prev) =>
			prev.map((account) =>
				account.id === id ? { ...account, status: 'ЗАКРЫТ' } : account,
			),
		)
		messageApi.success(`POST /api/v1/accounts/${id}/close (mock)`)
	}

	const handleOpenDetails = (account: typeof initialAccounts[number]) => {
		setSelectedAccount(account)
	}

	const handleExport = () => {
		messageApi.success(
			`GET /api/v1/accounts/${activeAccountId}/statement (mock)`,
		)
	}

	return (
		<div className='accounts'>
			{contextHolder}
			<div className='accounts__header'>
				<Title level={3}>Мои счета</Title>
				<Text type='secondary'>
					Всего средств: <strong>749 855.19 ₽</strong>
				</Text>
			</div>

			<div className='accounts__overview'>
				<div className='accounts__cards'>
					{accounts.map((account) => (
						<div
							key={account.id}
							className={`account-card ${
								activeAccountId === account.id ? 'account-card--active' : ''
							} account-card--${account.kind.toLowerCase()}`}
							onClick={() => setActiveAccountId(account.id)}
						>
							<div className='account-card__icon'>{account.icon}</div>
							<div className='account-card__status'>{account.status}</div>
							<div className='account-card__title'>{account.title}</div>
							<div className='account-card__balance'>{account.balance}</div>
							<div className='account-card__footer'>
								<Text type='secondary'>{account.mask}</Text>
								<Button
									type='link'
									onClick={(event) => {
										event.stopPropagation()
										handleOpenDetails(account)
									}}
								>
									Детали →
								</Button>
							</div>
							<div className='account-card__actions'>
								<Select
									value={account.status}
									onChange={(value) => handleStatusChange(account.id, value)}
									onClick={(event) => event.stopPropagation()}
									options={[
										{ value: 'АКТИВЕН', label: 'Активен' },
										{ value: 'ЗАБЛОКИРОВАН', label: 'Заблокирован' },
										{ value: 'ЗАКРЫТ', label: 'Закрыт' },
									]}
								/>
								<Button
									danger
									onClick={(event) => {
										event.stopPropagation()
										handleCloseAccount(account.id)
									}}
								>
									Закрыть
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='accounts__transactions'>
				<div className='accounts__toolbar'>
					<Segmented
						value={segmentValue}
						onChange={(value) => setSegmentValue(String(value))}
						options={['Все транзакции', 'Доходы', 'Расходы']}
					/>
					<div className='accounts__filters'>
						<Input
							placeholder='Поиск'
							prefix={<SearchOutlined />}
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
						/>
						<Select
							value={sortValue}
							onChange={(value) => setSortValue(value)}
							options={[
								{ value: 'date_desc', label: 'Сначала новые' },
								{ value: 'date_asc', label: 'Сначала старые' },
								{ value: 'amount_desc', label: 'Сумма по убыванию' },
								{ value: 'amount_asc', label: 'Сумма по возрастанию' },
							]}
						/>
						<Button icon={<DownloadOutlined />} onClick={handleExport}>
							Экспорт
						</Button>
					</div>
				</div>

				<div className='accounts-table'>
					<div
						className='accounts-table__row accounts-table__row--head'
					>
						<span>ТРАНЗАКЦИЯ</span>
						<span>КАТЕГОРИЯ</span>
						<span>ДАТА</span>
						<span>СУММА</span>
					</div>
					{filteredTransactions.map((item) => (
						<div className='accounts-table__row' key={item.id}>
							<div>
								<div className='accounts-table__title'>{item.title}</div>
								<Text type='secondary'>{item.subtitle}</Text>
							</div>
							<Text type='secondary'>{item.category}</Text>
							<Text type='secondary'>{item.date}</Text>
							<Text
								className={
									item.amount.startsWith('+')
										? 'accounts-table__amount--positive'
										: 'accounts-table__amount--negative'
								}
							>
								{item.amount}
							</Text>
						</div>
					))}
				</div>
			</div>
			<Modal
				open={Boolean(selectedAccount)}
				title='Детали счета'
				onCancel={() => setSelectedAccount(null)}
				footer={null}
			>
				{selectedAccount && (
					<div className='account-details'>
						<div>
							<Text type='secondary'>Название</Text>
							<div>{selectedAccount.title}</div>
						</div>
						<div>
							<Text type='secondary'>Баланс</Text>
							<div>{selectedAccount.balance}</div>
						</div>
						<div>
							<Text type='secondary'>Номер</Text>
							<div>{selectedAccount.mask}</div>
						</div>
						<div>
							<Text type='secondary'>Статус</Text>
							<div>{selectedAccount.status}</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	)
}
