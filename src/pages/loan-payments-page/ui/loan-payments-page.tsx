import {
	Button,
	InputNumber,
	Table,
	Tag,
	Typography,
	message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import './loan-payments-page.css'

const { Title, Text } = Typography

interface PaymentRow {
	key: string
	date: string
	amount: string
	principal: string
	interest: string
	status: 'PAID' | 'PENDING' | 'OVERDUE'
}

const scheduleRows: PaymentRow[] = [
	{
		key: '1',
		date: '25.01.2026',
		amount: '18 450.00 ₽',
		principal: '12 500.00 ₽',
		interest: '5 950.00 ₽',
		status: 'PENDING',
	},
	{
		key: '2',
		date: '25.12.2025',
		amount: '18 450.00 ₽',
		principal: '12 300.00 ₽',
		interest: '6 150.00 ₽',
		status: 'PAID',
	},
	{
		key: '3',
		date: '25.11.2025',
		amount: '18 450.00 ₽',
		principal: '12 100.00 ₽',
		interest: '6 350.00 ₽',
		status: 'PAID',
	},
]

const paymentHistory = [
	{
		id: 1,
		title: 'Платеж по кредиту',
		date: '25.12.2025',
		amount: '-18 450.00 ₽',
	},
	{
		id: 2,
		title: 'Досрочное погашение',
		date: '10.12.2025',
		amount: '-35 000.00 ₽',
	},
]

export function LoanPaymentsPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const columns: ColumnsType<PaymentRow> = [
		{ title: 'Дата', dataIndex: 'date', key: 'date' },
		{ title: 'Сумма', dataIndex: 'amount', key: 'amount' },
		{ title: 'Тело', dataIndex: 'principal', key: 'principal' },
		{ title: 'Проценты', dataIndex: 'interest', key: 'interest' },
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (value: PaymentRow['status']) => {
				const color =
					value === 'PAID' ? 'green' : value === 'OVERDUE' ? 'red' : 'orange'
				const label =
					value === 'PAID'
						? 'Оплачен'
						: value === 'OVERDUE'
							? 'Просрочен'
							: 'Ожидает'

				return <Tag color={color}>{label}</Tag>
			},
		},
	]

	return (
		<div className='loan-payments'>
			{contextHolder}
			<div className='loan-payments__header'>
				<div>
					<Title level={3}>Платежи по кредиту</Title>
					<Text type='secondary'>
						График платежей и управление погашением
					</Text>
				</div>
				<Button type='primary' onClick={() => messageApi.success('Оплата (mock)')}>
					Оплатить
				</Button>
			</div>

			<div className='loan-payments__grid'>
				<div className='loan-payments__schedule'>
					<div className='loan-payments__section-header'>
						<Title level={5}>График платежей</Title>
					</div>
					<Table columns={columns} dataSource={scheduleRows} pagination={false} />
				</div>

				<div className='loan-payments__side'>
					<div className='loan-payments__card'>
						<Title level={5}>Досрочное погашение</Title>
						<Text type='secondary'>
							Укажите сумму досрочного погашения
						</Text>
						<div className='loan-payments__field'>
							<InputNumber min={0} addonAfter='₽' />
						</div>
						<Button
							type='primary'
							block
							onClick={() => messageApi.success('Заявка создана (mock)')}
						>
							Погасить досрочно
						</Button>
					</div>

					<div className='loan-payments__card'>
						<Title level={5}>Калькулятор</Title>
						<Text type='secondary'>
							Рассчитайте изменение графика
						</Text>
						<div className='loan-payments__field'>
							<InputNumber min={0} addonAfter='₽' />
						</div>
						<Button block>Рассчитать</Button>
					</div>

					<div className='loan-payments__card'>
						<div className='loan-payments__section-header'>
							<Title level={5}>История платежей</Title>
							<Button type='link'>Вся история</Button>
						</div>
						<div className='loan-payments__history'>
							{paymentHistory.map((item) => (
								<div key={item.id} className='loan-payments__history-item'>
									<div>
										<div className='loan-payments__history-title'>
											{item.title}
										</div>
										<Text type='secondary'>{item.date}</Text>
									</div>
									<Text className='loan-payments__history-amount'>
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
