import {
	Button,
	InputNumber,
	Select,
	Switch,
	Tag,
	Typography,
	message,
} from 'antd'
import './cards-page.css'

const { Title, Text } = Typography

const cards = [
	{
		id: 1,
		title: 'BankFinTech Premium',
		number: '**** 4589',
		balance: '124 530.25 ₽',
		status: 'ACTIVE',
		limit: 50000,
	},
	{
		id: 2,
		title: 'Travel Card',
		number: '**** 9021',
		balance: '32 700.00 ₽',
		status: 'BLOCKED',
		limit: 20000,
	},
	{
		id: 3,
		title: 'Everyday',
		number: '**** 2234',
		balance: '8 540.90 ₽',
		status: 'ACTIVE',
		limit: 15000,
	},
]

const operations = [
	{
		id: 1,
		title: 'Яндекс музыка',
		date: '19.01.2026',
		amount: '-200.00 ₽',
	},
	{
		id: 2,
		title: 'Uber',
		date: '19.01.2026',
		amount: '-437.00 ₽',
	},
	{
		id: 3,
		title: 'TechCorp Inc.',
		date: '19.01.2026',
		amount: '+20 099.00 ₽',
	},
]

export function CardsPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const handleToggle = () => {
		messageApi.success('Статус карты обновлён (mock)')
	}

	const handleLimitSave = () => {
		messageApi.success('Лимиты сохранены (mock)')
	}

	return (
		<div className='cards'>
			{contextHolder}
			<div className='cards__header'>
				<Title level={3}>Карты</Title>
				<Text type='secondary'>Управление банковскими картами</Text>
			</div>

			<div className='cards__grid'>
				<div className='cards__list'>
					<div className='cards__section-header'>
						<Title level={5}>Список карт</Title>
						<Button type='primary'>Новая карта</Button>
					</div>
					<div className='cards__items'>
						{cards.map((card) => (
							<div key={card.id} className='cards__item'>
								<div>
									<div className='cards__item-title'>{card.title}</div>
									<Text type='secondary'>{card.number}</Text>
								</div>
								<div className='cards__item-meta'>
									<Text className='cards__item-balance'>
										{card.balance}
									</Text>
									<Tag color={card.status === 'ACTIVE' ? 'green' : 'red'}>
										{card.status === 'ACTIVE' ? 'Активна' : 'Заморожена'}
									</Tag>
								</div>
								<div className='cards__item-actions'>
									<Text type='secondary'>Заморозка</Text>
									<Switch
										checked={card.status === 'BLOCKED'}
										onChange={handleToggle}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='cards__side'>
					<div className='cards__limits'>
						<div className='cards__section-header'>
							<Title level={5}>Управление лимитами</Title>
						</div>
						<div className='cards__limit-row'>
							<Text type='secondary'>Карта</Text>
							<Select
								defaultValue={cards[0].id}
								options={cards.map((card) => ({
									value: card.id,
									label: `${card.title} ${card.number}`,
								}))}
							/>
						</div>
						<div className='cards__limit-row'>
							<Text type='secondary'>Лимит на день</Text>
							<InputNumber min={0} defaultValue={50000} addonAfter='₽' />
						</div>
						<div className='cards__limit-row'>
							<Text type='secondary'>Лимит на операции</Text>
							<InputNumber min={0} defaultValue={20000} addonAfter='₽' />
						</div>
						<Button type='primary' onClick={handleLimitSave} block>
							Сохранить лимиты
						</Button>
					</div>

					<div className='cards__history'>
						<div className='cards__section-header'>
							<Title level={5}>История операций</Title>
							<Button type='link'>Вся история</Button>
						</div>
						<div className='cards__history-list'>
							{operations.map((item) => (
								<div key={item.id} className='cards__history-item'>
									<div>
										<div className='cards__history-title'>{item.title}</div>
										<Text type='secondary'>{item.date}</Text>
									</div>
									<Text
										className={
											item.amount.startsWith('+')
												? 'cards__history-amount cards__history-amount--positive'
												: 'cards__history-amount'
										}
									>
										{item.amount}
									</Text>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
