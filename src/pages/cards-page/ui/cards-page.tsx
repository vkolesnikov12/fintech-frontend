import {
	Button,
	InputNumber,
	Modal,
	Radio,
	Select,
	Switch,
	Tag,
	Typography,
	message,
} from 'antd'
import { useState } from 'react'
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

const availableCardTypes = [
	{
		id: 'virtual',
		name: 'Виртуальная карта',
		description: 'Для онлайн‑покупок',
	},
	{
		id: 'plastic',
		name: 'Пластиковая карта',
		description: 'Доставка на дом',
	},
	{
		id: 'premium',
		name: 'Премиальная карта',
		description: 'Повышенные лимиты',
	},
]

export function CardsPage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [limitMode, setLimitMode] = useState('daily')
	const [selectedCardId, setSelectedCardId] = useState(cards[0].id)
	const [isNewCardOpen, setIsNewCardOpen] = useState(false)
	const [selectedCardType, setSelectedCardType] = useState<string | undefined>(
		undefined,
	)

	const handleToggle = () => {
		messageApi.success(
			`PATCH /api/v1/accounts/${selectedCardId}/status (mock)`,
		)
	}

	const handleLimitSave = () => {
		messageApi.success('POST /api/v1/accounts/{id}/limit (mock)')
	}

	const handleNewCard = () => {
		messageApi.info('GET /api/v1/cards/types (mock)')
		setIsNewCardOpen(true)
	}

	const handleOpenHistory = () => {
		messageApi.info(
			`GET /api/v1/accounts/${selectedCardId}/statement (mock)`,
		)
	}

	const handleCreateCard = () => {
		if (!selectedCardType) {
			messageApi.error('Выберите тип карты')
			return
		}

		messageApi.success('POST /api/v1/accounts (mock)')
		setIsNewCardOpen(false)
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
						<Button type='primary' onClick={handleNewCard}>
							Новая карта
						</Button>
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
							<Text type='secondary'>Тип лимита</Text>
							<Radio.Group
								value={limitMode}
								onChange={(event) => setLimitMode(event.target.value)}
							>
								<Radio value='daily'>Дневной</Radio>
								<Radio value='transaction'>На операцию</Radio>
							</Radio.Group>
						</div>
						<div className='cards__limit-row'>
							<Text type='secondary'>Карта</Text>
							<Select
								value={selectedCardId}
								onChange={(value) => setSelectedCardId(value)}
								options={cards.map((card) => ({
									value: card.id,
									label: `${card.title} ${card.number}`,
								}))}
							/>
						</div>
						<div className='cards__limit-row'>
							<Text type='secondary'>Лимит на день</Text>
							<InputNumber
								min={0}
								defaultValue={50000}
								addonAfter='₽'
								disabled={limitMode !== 'daily'}
							/>
						</div>
						<div className='cards__limit-row'>
							<Text type='secondary'>Лимит на операции</Text>
							<InputNumber
								min={0}
								defaultValue={20000}
								addonAfter='₽'
								disabled={limitMode !== 'transaction'}
							/>
						</div>
						<Button type='primary' onClick={handleLimitSave} block>
							Сохранить лимиты
						</Button>
					</div>

					<div className='cards__history'>
						<div className='cards__section-header'>
							<Title level={5}>История операций</Title>
							<Button type='link' onClick={handleOpenHistory}>
								Вся история
							</Button>
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
			<Modal
				open={isNewCardOpen}
				title='Новая карта'
				onCancel={() => setIsNewCardOpen(false)}
				onOk={handleCreateCard}
				okText='Оформить'
				cancelText='Отмена'
			>
				<div className='cards__modal'>
					<Select
						placeholder='Выберите тип карты'
						value={selectedCardType}
						onChange={(value) => setSelectedCardType(value)}
						options={availableCardTypes.map((type) => ({
							value: type.id,
							label: type.name,
						}))}
					/>
					{selectedCardType && (
						<div className='cards__modal-info'>
							<Text type='secondary'>
								{
									availableCardTypes.find(
										(type) => type.id === selectedCardType,
									)?.description
								}
							</Text>
						</div>
					)}
				</div>
			</Modal>
		</div>
	)
}
