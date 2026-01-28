import {
	ArrowDownOutlined,
	FileTextOutlined,
	QrcodeOutlined,
} from '@ant-design/icons'
import { Button, Tag, Typography } from 'antd'
import './dashboard-page.css'

const { Text } = Typography

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
		subtitle: 'Транспорт',
		category: 'Передвижение',
		date: '19.01.2026',
		amount: '-437.00 ₽',
	},
	{
		id: 3,
		title: 'TechCorp Inc.',
		subtitle: 'Прямой депозит',
		category: 'Доход',
		date: '19.01.2026',
		amount: '+81 796.00 ₽',
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

const notifications = [
	{
		id: 1,
		title: 'Доступно новое заявление',
		text: [
			'Выписка с вашего текущего счета за декабрь 2025 года',
			'готова к загрузке.',
		].join(' '),
		time: 'Сегодня, 9:00',
		status: 'info',
	},
	{
		id: 2,
		title: 'Пароль изменён',
		text: [
			'Пароль вашей учетной записи был успешно обновлен',
			'с нового устройства.',
		].join(' '),
		time: 'Вчера',
		status: 'success',
	},
	{
		id: 3,
		title: 'Плановое техническое обслуживание',
		text: [
			'Техническое обслуживание системы запланировано на',
			'2 часа ночи в воскресенье.',
		].join(' '),
		time: '10 января',
		status: 'neutral',
	},
]

export function DashboardPage() {
	return (
		<div className='dashboard'>
			<div className='dashboard__actions'>
				<Button icon={<ArrowDownOutlined />}>Перевод</Button>
				<Button icon={<FileTextOutlined />}>Скачать заявление</Button>
				<Button icon={<QrcodeOutlined />}>QR - оплата</Button>
			</div>

			<div className='dashboard__cards'>
				<div className='dashboard-card'>
					<Text type='secondary'>Общая ликвидность</Text>
					<div className='dashboard-card__amount'>262 854.92 ₽</div>
					<div className='dashboard-card__trend'>
						<Tag color='green'>+2.4%</Tag>
						<Text type='secondary'>В этом месяце</Text>
					</div>
				</div>
				<div className='dashboard-card'>
					<Text type='secondary'>Активные продукты</Text>
					<div className='dashboard-card__amount'>3 счета</div>
					<div className='dashboard-card__avatars'>
						<span className='dashboard-card__avatar'>Ос</span>
						<span className='dashboard-card__avatar'>Сч</span>
						<span className='dashboard-card__avatar'>Пут</span>
						<Text className='dashboard-card__link'>Посмотреть все</Text>
					</div>
				</div>
				<div className='dashboard-card dashboard-card--accent'>
					<Text type='secondary'>Активное приложение</Text>
					<div className='dashboard-card__amount'>
						Рефинансирование ипотеки
					</div>
					<div className='dashboard-card__status'>
						<span>ОЖИДАЕТ УТВЕРЖДЕНИЯ</span>
						<Text type='secondary'>Обновлено 2 часа назад</Text>
					</div>
					<div className='dashboard-card__progress' />
				</div>
			</div>

			<div className='dashboard__grid'>
				<div className='dashboard-panel'>
					<div className='dashboard-panel__header'>
						<span>Последние транзакции</span>
						<Button type='link'>Вся история</Button>
					</div>
					<div className='dashboard-table'>
						<div
							className='dashboard-table__row dashboard-table__row--head'
						>
							<span>ТРАНЗАКЦИЯ</span>
							<span>КАТЕГОРИЯ</span>
							<span>ДАТА</span>
							<span>СУММА</span>
						</div>
						{transactions.map((item) => (
							<div className='dashboard-table__row' key={item.id}>
								<div>
									<div className='dashboard-table__title'>{item.title}</div>
									<Text type='secondary'>{item.subtitle}</Text>
								</div>
								<Text type='secondary'>{item.category}</Text>
								<Text type='secondary'>{item.date}</Text>
								<Text
									className={
										item.amount.startsWith('+')
											? 'dashboard-table__amount--positive'
											: 'dashboard-table__amount--negative'
									}
								>
									{item.amount}
								</Text>
							</div>
						))}
					</div>
				</div>
				<div className='dashboard-panel dashboard-panel--compact'>
					<div className='dashboard-panel__header'>
						<span>Уведомления</span>
						<Button type='link'>Вся история</Button>
					</div>
					<div className='dashboard-notifications'>
						{notifications.map((item) => {
							const dotClass = [
								'dashboard-notifications__dot',
								`dashboard-notifications__dot--${item.status}`,
							].join(' ')

							return (
								<div
									className='dashboard-notifications__item'
									key={item.id}
								>
									<div className={dotClass} />
									<div>
										<div className='dashboard-notifications__title'>
											{item.title}
										</div>
										<Text type='secondary'>{item.text}</Text>
										<div className='dashboard-notifications__time'>
											{item.time}
										</div>
									</div>
								</div>
							)
						})}
					</div>
					<Button className='dashboard-notifications__action' block>
						Просмотр всех уведомлений
					</Button>
				</div>
			</div>
		</div>
	)
}
