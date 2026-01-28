import {
	BankOutlined,
	DownloadOutlined,
	SearchOutlined,
	WalletOutlined,
} from '@ant-design/icons'
import {
	Button,
	Input,
	Segmented,
	Typography,
} from 'antd'
import './accounts-page.css'

const { Title, Text } = Typography

const accounts = [
	{
		id: 1,
		title: 'Основной счёт',
		balance: '70 355.19 ₽',
		status: 'АКТИВЕН',
		mask: '**** 4589',
		isActive: true,
		icon: <WalletOutlined />,
	},
	{
		id: 2,
		title: 'Накопительный счёт',
		balance: '679 500.00 ₽',
		status: 'АКТИВЕН',
		mask: '**** 9021',
		icon: <BankOutlined />,
	},
	{
		id: 3,
		title: 'Кредитный счёт для путешествий',
		balance: '30 000.00 ₽',
		status: 'АКТИВЕН',
		mask: '**** 2234',
		icon: <BankOutlined />,
	},
]

const transactions = [
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
]

export function AccountsPage() {
	return (
		<div className='accounts'>
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
								account.isActive ? 'account-card--active' : ''
							}`}
						>
							<div className='account-card__icon'>{account.icon}</div>
							<div className='account-card__status'>{account.status}</div>
							<div className='account-card__title'>{account.title}</div>
							<div className='account-card__balance'>{account.balance}</div>
							<div className='account-card__footer'>
								<Text type='secondary'>{account.mask}</Text>
								<Button type='link'>Детали →</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='accounts__transactions'>
				<div className='accounts__toolbar'>
					<Segmented
						defaultValue='Все транзакции'
						options={['Все транзакции', 'Доходы', 'Расходы']}
					/>
					<div className='accounts__filters'>
						<Input
							placeholder='Поиск'
							prefix={<SearchOutlined />}
						/>
						<Button>Этот месяц</Button>
						<Button icon={<DownloadOutlined />} />
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
					{transactions.map((item) => (
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
		</div>
	)
}
