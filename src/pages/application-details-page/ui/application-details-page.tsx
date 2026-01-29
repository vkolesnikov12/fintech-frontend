import {
	Button,
	Divider,
	Input,
	Progress,
	Space,
	Table,
	Tag,
	Tabs,
	Typography,
	message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import './application-details-page.css'

const { Title, Text } = Typography
const { TextArea } = Input

const documents = [
	{
		key: '1',
		name: 'Паспорт',
		status: 'READY',
		uploadedAt: '19.01.2026',
	},
	{
		key: '2',
		name: 'Справка 2‑НДФЛ',
		status: 'PROCESSING',
		uploadedAt: '19.01.2026',
	},
]

const historyRows = [
	{
		key: '1',
		action: 'Заявка создана',
		date: '19.01.2026 10:25',
		author: 'Клиент',
	},
	{
		key: '2',
		action: 'Назначен менеджер',
		date: '19.01.2026 11:10',
		author: 'Система',
	},
]

const comments = [
	{
		id: 1,
		author: 'Менеджер Анна',
		time: 'Сегодня, 12:45',
		text: 'Запрошены документы по доходу.',
	},
	{
		id: 2,
		author: 'Клиент',
		time: 'Сегодня, 13:05',
		text: 'Документы загрузил.',
	},
]

export function ApplicationDetailsPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const documentsColumns: ColumnsType<typeof documents[number]> = [
		{ title: 'Документ', dataIndex: 'name', key: 'name' },
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (value: string) => (
				<Tag color={value === 'READY' ? 'green' : 'orange'}>
					{value === 'READY' ? 'Готов' : 'В обработке'}
				</Tag>
			),
		},
		{ title: 'Дата', dataIndex: 'uploadedAt', key: 'uploadedAt' },
	]

	const historyColumns: ColumnsType<typeof historyRows[number]> = [
		{ title: 'Действие', dataIndex: 'action', key: 'action' },
		{ title: 'Дата', dataIndex: 'date', key: 'date' },
		{ title: 'Автор', dataIndex: 'author', key: 'author' },
	]

	return (
		<div className='application-details'>
			{contextHolder}
			<div className='application-details__header'>
				<div>
					<Title level={3}>Заявка #1284</Title>
					<Text type='secondary'>Кредит наличными • 240 000 ₽</Text>
				</div>
				<Space>
					<Button onClick={() => messageApi.success('Запрос отправлен (mock)')}>
						Запросить
					</Button>
					<Button
						type='primary'
						onClick={() => messageApi.success('Заявка одобрена (mock)')}
					>
						Одобрить
					</Button>
					<Button
						danger
						onClick={() => messageApi.error('Заявка отклонена (mock)')}
					>
						Отклонить
					</Button>
				</Space>
			</div>

			<div className='application-details__card'>
				<Tabs
					items={[
						{
							key: 'base',
							label: 'Основное',
							children: (
								<div className='application-details__grid'>
									<div>
										<Text type='secondary'>Клиент</Text>
										<div className='application-details__value'>Иван Петров</div>
									</div>
									<div>
										<Text type='secondary'>Статус</Text>
										<div className='application-details__value'>
											<Tag color='orange'>В обработке</Tag>
										</div>
									</div>
									<div>
										<Text type='secondary'>Сумма</Text>
										<div className='application-details__value'>240 000 ₽</div>
									</div>
									<div>
										<Text type='secondary'>Срок</Text>
										<div className='application-details__value'>24 мес</div>
									</div>
									<div>
										<Text type='secondary'>Продукт</Text>
										<div className='application-details__value'>Кредит наличными</div>
									</div>
									<div>
										<Text type='secondary'>Дата подачи</Text>
										<div className='application-details__value'>19.01.2026</div>
									</div>
								</div>
							),
						},
						{
							key: 'scoring',
							label: 'Скоринг',
							children: (
								<div className='application-details__scoring'>
									<div>
										<Text type='secondary'>Кредитный рейтинг</Text>
										<div className='application-details__score'>742</div>
										<Tag color='green'>LOW RISK</Tag>
									</div>
									<div className='application-details__progress'>
										<Text type='secondary'>Риск</Text>
										<Progress percent={72} />
									</div>
								</div>
							),
						},
						{
							key: 'documents',
							label: 'Документы',
							children: (
								<Table
									columns={documentsColumns}
									dataSource={documents}
									pagination={false}
								/>
							),
						},
						{
							key: 'history',
							label: 'История',
							children: (
								<Table
									columns={historyColumns}
									dataSource={historyRows}
									pagination={false}
								/>
							),
						},
						{
							key: 'comments',
							label: 'Комментарии',
							children: (
								<div className='application-details__comments'>
									{comments.map((comment) => (
										<div key={comment.id} className='application-details__comment'>
											<div className='application-details__comment-header'>
												<Text strong>{comment.author}</Text>
												<Text type='secondary'>{comment.time}</Text>
											</div>
											<Text>{comment.text}</Text>
										</div>
									))}
									<Divider />
									<TextArea rows={3} placeholder='Добавить комментарий' />
									<Button
										type='primary'
										onClick={() => messageApi.success('Комментарий отправлен')}
									>
										Отправить
									</Button>
								</div>
							),
						},
					]}
				/>
			</div>
		</div>
	)
}
