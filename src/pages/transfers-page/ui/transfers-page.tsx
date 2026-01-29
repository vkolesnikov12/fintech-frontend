import {
	Button,
	Form,
	Input,
	InputNumber,
	Select,
	Space,
	Tabs,
	Tag,
	Typography,
	message,
} from 'antd'
import './transfers-page.css'

const { Title, Text } = Typography

const accounts = [
	{ value: 'acc-1', label: 'Основной счёт •••• 4589' },
	{ value: 'acc-2', label: 'Накопительный счёт •••• 9021' },
	{ value: 'acc-3', label: 'Кредитный счёт •••• 2234' },
]

const transferHistory = [
	{
		id: 1,
		title: 'Перевод между счетами',
		amount: '-12 500.00 ₽',
		date: '19.01.2026',
		status: 'COMPLETED',
	},
	{
		id: 2,
		title: 'Перевод клиенту',
		amount: '-7 200.00 ₽',
		date: '18.01.2026',
		status: 'PENDING',
	},
	{
		id: 3,
		title: 'Перевод по реквизитам',
		amount: '-35 000.00 ₽',
		date: '15.01.2026',
		status: 'COMPLETED',
	},
]

const templates = [
	{
		id: 1,
		title: 'Аренда квартиры',
		details: 'ООО ДомСервис •••• 7788',
	},
	{
		id: 2,
		title: 'Коммунальные услуги',
		details: 'ГК Услуги •••• 1209',
	},
	{
		id: 3,
		title: 'Семейный перевод',
		details: 'Счёт •••• 4589',
	},
]

export function TransfersPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const handleSubmit = () => {
		messageApi.success('Перевод отправлен (mock)')
	}

	return (
		<div className='transfers'>
			{contextHolder}
			<div className='transfers__header'>
				<Title level={3}>Переводы</Title>
				<Text type='secondary'>
					Переводы между счетами, другим клиентам, по реквизитам
				</Text>
			</div>

			<div className='transfers__layout'>
				<div className='transfers__form-card'>
					<Tabs
						defaultActiveKey='internal'
						items={[
							{
								key: 'internal',
								label: 'Между своими',
								children: (
									<Form layout='vertical' onFinish={handleSubmit}>
										<Form.Item
											label='Списать со счета'
											name='fromAccount'
											rules={[
												{
													required: true,
													message: 'Выберите счет',
												},
											]}
										>
											<Select options={accounts} />
										</Form.Item>
										<Form.Item
											label='Зачислить на счет'
											name='toAccount'
											rules={[
												{
													required: true,
													message: 'Выберите счет',
												},
											]}
										>
											<Select options={accounts} />
										</Form.Item>
										<Form.Item
											label='Сумма'
											name='amount'
											rules={[
												{
													required: true,
													message: 'Введите сумму',
												},
											]}
										>
											<InputNumber min={0} addonAfter='₽' />
										</Form.Item>
										<Form.Item label='Комментарий' name='comment'>
											<Input placeholder='Например: Пополнение' />
										</Form.Item>
										<Button type='primary' htmlType='submit' block>
											Перевести
										</Button>
									</Form>
								),
							},
							{
								key: 'client',
								label: 'Другому клиенту',
								children: (
									<Form layout='vertical' onFinish={handleSubmit}>
										<Form.Item
											label='Списать со счета'
											name='fromAccount'
											rules={[
												{
													required: true,
													message: 'Выберите счет',
												},
											]}
										>
											<Select options={accounts} />
										</Form.Item>
										<Form.Item
											label='Получатель'
											name='recipient'
											rules={[
												{
													required: true,
													message: 'Введите получателя',
												},
											]}
										>
											<Input placeholder='ФИО или логин' />
										</Form.Item>
										<Form.Item
											label='Телефон или email'
											name='contact'
											rules={[
												{
													required: true,
													message: 'Введите контакт',
												},
											]}
										>
											<Input placeholder='+7 (900) 000-00-00' />
										</Form.Item>
										<Form.Item
											label='Сумма'
											name='amount'
											rules={[
												{
													required: true,
													message: 'Введите сумму',
												},
											]}
										>
											<InputNumber min={0} addonAfter='₽' />
										</Form.Item>
										<Form.Item label='Назначение' name='purpose'>
											<Input placeholder='Перевод клиенту' />
										</Form.Item>
										<Button type='primary' htmlType='submit' block>
											Перевести
										</Button>
									</Form>
								),
							},
							{
								key: 'details',
								label: 'По реквизитам',
								children: (
									<Form layout='vertical' onFinish={handleSubmit}>
										<Form.Item
											label='Списать со счета'
											name='fromAccount'
											rules={[
												{
													required: true,
													message: 'Выберите счет',
												},
											]}
										>
											<Select options={accounts} />
										</Form.Item>
										<Form.Item
											label='Получатель'
											name='recipient'
											rules={[
												{
													required: true,
													message: 'Введите получателя',
												},
											]}
										>
											<Input placeholder='ООО Ромашка' />
										</Form.Item>
										<div className='transfers__grid'>
											<Form.Item
												label='ИНН'
												name='inn'
												rules={[
													{
														required: true,
														message: 'Введите ИНН',
													},
												]}
											>
												<Input />
											</Form.Item>
											<Form.Item
												label='КПП'
												name='kpp'
												rules={[
													{
														required: true,
														message: 'Введите КПП',
													},
												]}
											>
												<Input />
											</Form.Item>
										</div>
										<Form.Item
											label='БИК'
											name='bic'
											rules={[
												{
													required: true,
													message: 'Введите БИК',
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label='Счет получателя'
											name='account'
											rules={[
												{
													required: true,
													message: 'Введите счет',
												},
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											label='Сумма'
											name='amount'
											rules={[
												{
													required: true,
													message: 'Введите сумму',
												},
											]}
										>
											<InputNumber min={0} addonAfter='₽' />
										</Form.Item>
										<Form.Item label='Назначение' name='purpose'>
											<Input placeholder='Оплата по счету' />
										</Form.Item>
										<Button type='primary' htmlType='submit' block>
											Перевести
										</Button>
									</Form>
								),
							},
						]}
					/>
				</div>

				<div className='transfers__side'>
					<div className='transfers__history'>
						<div className='transfers__section-header'>
							<Title level={5}>История переводов</Title>
							<Button type='link'>Вся история</Button>
						</div>
						<Space direction='vertical' size={12} className='transfers__list'>
							{transferHistory.map((item) => (
								<div key={item.id} className='transfers__list-item'>
									<div>
										<div className='transfers__list-title'>{item.title}</div>
										<Text type='secondary'>{item.date}</Text>
									</div>
									<div className='transfers__list-meta'>
										<Text>{item.amount}</Text>
										<Tag
											color={item.status === 'COMPLETED' ? 'green' : 'orange'}
										>
											{item.status === 'COMPLETED'
												? 'Завершен'
												: 'В обработке'}
										</Tag>
									</div>
								</div>
							))}
						</Space>
					</div>

					<div className='transfers__templates'>
						<div className='transfers__section-header'>
							<Title level={5}>Шаблоны</Title>
							<Button type='link'>Все шаблоны</Button>
						</div>
						<Space direction='vertical' size={10} className='transfers__list'>
							{templates.map((item) => (
								<div key={item.id} className='transfers__template'>
									<div className='transfers__template-title'>{item.title}</div>
									<Text type='secondary'>{item.details}</Text>
								</div>
							))}
						</Space>
					</div>
				</div>
			</div>
		</div>
	)
}
